/**
 *  Calc.ts
 *      Generate data tables and do basic data analytics 
 */
 
 import { Db, Table, Geom,  } from './internal'; 
 import { Metric, MetricName, MetricOptions, TableLocation, DataRows, isDataRows, isMetricName } from './internal' // types and typeguards
 import { METRICS } from './internal' // constants

 declare var WorkerGlobalScope: any; // avoid TS errors with possible unknown variable

 export class Calc
 {
    //// SETTINGS ////
    ENABLE_DANFO = false;
    //// END SETTINGS ////

    _danfo;
    _geom;
    db:Db // the virtual database with table in there
    dbData:Object // raw outputted data 
    _metrics:{[key:string]:Metric} = {};

    constructor(geom:Geom = null)
    {
        this._geom = geom; // needed to get data from the model

        if(this.ENABLE_DANFO)
        {
            this.loadDanfo()
                .catch(this.handleFailedDanfoImport)
                .then(() => this.init());
        }
        else {
            this.init();
        }

    }

    /** Load Danfo module dynamically based on enviroment */
    async loadDanfo():Promise<any> // TODO TS typing
    {   
        // detect context of JS
        const DANFO_MODULE = 'danfojs';
        const isBrowser = typeof window === 'object'
        let isWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
        const isNode = !isWorker && !isBrowser;

        if(isWorker || isBrowser)
        {
            console.log('==== LOAD DANFO FOR BROWSER/WORKER ====')
            this._danfo = await import(DANFO_MODULE)
        }
        else {
            console.log('==== LOAD DANFO FOR NODE ====')
            // keep this out import(..) to avoid being picked up by Webpack in client
            // looks like NodeJS can search node_modules in webworker for the danfojs-node library
            const nodeDanfoPath = 'danfojs-node'; 
            this._danfo = await import(nodeDanfoPath)
        }

        if(this._danfo)
        {
            console.info('==== DANFO LOADED ====');
        }
 
        return this._danfo;
    }

    hasDanfo():boolean
    {
        return (this._danfo !== undefined)
    }

    handleFailedDanfoImport(e)
    {
        console.error(`!!!! Calc: Cannot import Danfo module: "${e}"
        Calc will have limited abilities. Add danfojs or danfojs-node to your node_modules!!!!`);
    }

    /** We need to know when we can load the Shapes */
    init()
    {
        this.db = new Db(this._geom, this._danfo);
    }

    /** Automatically calc.init() when user uses calc module */
    autoInit()
    {
        // NOTE: We can't init without danfo loaded!
        if(this.hasDanfo() && !this.db.isInitiated())
        {
            this?.db?.init();
        }
    }

    reset()
    {
        this?.db?.reset();
        this._metrics = {};
    }

    /** Get names of tables */
    tables():Array<string>
    {
        return this?.db?.tables();
    }

    //// CREATION API ////

    /** Make or get table with data 
     *  @param name string
     *  @param data [ val1, val2, val3 ] or [{ col1: val1, col2: val2 }{ ... }]
    */
    table(name:string, data?:DataRows, columns?:Array<string>):Calc|Table
    {   
        //this.autoInit(); // Not needed: Danfo is disabled

        if(!name){ throw new Error(`Calc::table: Please supply a table name`); }

        // get table
        if(name && !data && !columns)
        {
            if(!this.tables().includes(name))
            { 
                throw new Error(`Calc::table(${name}): Table name "${name}" doest not exist! Use tables() to get available tables`); 
            }
            else {
                return this.db.table(name);
            }
        }

        if(this.tables().includes(name)){ throw new Error(`Calc::table: Table name "${name}" already exists! Please use an unique name`); }
        if(!isDataRows(data)){ throw new Error(`Calc::table: Please supply data in format [{ col1: val1, col2: val2}] or [val1,val2] and supply column names as third parameter!`); }
        
        const newTable = new Table(data)
        newTable.name(name);
        if(Array.isArray(columns))
        {
            newTable.setColumns(columns)
        }
        this.db.saveTable(newTable);
        
        return newTable;
    }

    /** Output raw data */
    toTableData():{[key:string]:Object}
    {   
        return this?.db?.toTableData(); 
    }

    //// METRIC BOARD ////

    /** Export metrics */
    metrics():Record<string,Metric>
    {
        return this._metrics;
    }   

    /** Add Metric element to dashboard */
    metric(name:MetricName, data:string|number, options:MetricOptions):Metric // TODO: Metric setting typing
    {
        // some decent checking
        if (!name){ throw new Error(`Calc::metric: Please name your metric! metric('name of your metric', ...)`)}
        if (data === null || data === undefined){ throw new Error(`Calc::metric: Please supply some data reference. Either an real value or table name or location as string!`)};
        if(!isMetricName(name))
        {
            console.warn(`Calc::metric: Your metric "${name}" is not part of official ones: ${METRICS.join(', ')}`);
        }

        //this.autoInit(); // Disabled because we don't need Danfo

        // make metric data structure
        const metric = {  
                name: name,
                label: options?.label || name,
                type: 'text', // only text is implemented now
                data: data,
                options: options
        } as Metric

        this._metrics[name] = metric;
        
        return metric;

    } 

    /** Convert metrics to own table */
    metricsToTable():Table
    {
        return this.table('metrics', 
            Object.values(this._metrics).map(m => { return [m?.label || m.name, m.data] }),
            ['name', 'value']
        ) as Table
    }

    //// UTILS ////

    /** Get raw data by simple table lookup with location and return TableLocation object 
     *  We can expect values like:
     *       tableName
     *       otherTable.columnname => all values in column
     *       otherTable[1] => all values in row
    */
    _resolveTableLocation(tableLocation:string):TableLocation
    {
        // TMP DISABLED
        if (!this.db) return 

        // basic error checking
        if(typeof tableLocation !== 'string'){ throw new Error(`Calc::_resolveTableLocation: Please supply a string such as 'tablename', 'tablename.columname' or 'tablename[1]!`)}
        
        // table
        if(!tableLocation.includes('.')) 
        {
            let table = this.db.table(tableLocation)
            if (!table){ throw new Error(`Calc::_resolveTableLocation: No such table '${tableLocation}'!`) };
            return { location: tableLocation, table: table, data: table.toDataRows() }; // TODO: is this output good? Array<Object>
        }
        // column 
        const COLUMN_RE = /(?<table>[^\.]+).(?<columnName>[.]+)/;
        let m = tableLocation.match(COLUMN_RE);
        if(m)
        {
            let columnName = m?.groups.columnName;
            let table = this.db.table(m?.groups.table);
            if (!table){ throw new Error(`Calc::_resolveTableLocation: No such table '${tableLocation}'!`) };
            return {    location : tableLocation, 
                        table: table, 
                        column: columnName,
                        data: table.toDataColumn(columnName) 
                    }
        }

        // row
        const ROW_RE = /(?<table>[^\[]+)\[(?<index>[\d]+)\]/
        let rm = tableLocation.match(ROW_RE);
        if (!rm){ throw new Error(`Calc::_resolveTableLocation: Could not find column or row!`) };
        let table = this.db.table(m.groups.table);
        if (!table){ throw new Error(`Calc::_resolveTableLocation: No such table '${tableLocation}'!`) };
        let rowIndex = parseInt(m.groups.index);
        return { 
                    location: tableLocation,
                    table: table,
                    row: rowIndex,
                    data: table.toDataRows[rowIndex]
        }
    }
    

 }
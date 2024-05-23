import { Geom, Vertex, Edge } from '../../src/internal' // import only from internal, otherwise we get circular import problems
import OcLoader from '../../src/OcLoader'

// see Jest docs: https://jestjs.io/docs/expect

let geom;
console.geom = console.log;

beforeAll(async () => 
{
    let ocLoader = new OcLoader();
    await ocLoader.loadAsync(); // Jest waits for the promise to be resolved
    geom = new Geom(); // needed to set oc on all other Shapes
});

test("Selectors Basics", () => 
{
    const W = 10;
    const H = 20;
    const D = 30;
    const b = geom.Box(W,D,H);
    // Parallel
    expect(b.select('E|X').length).toEqual(4);
    expect(b.select('E|Z').length).toEqual(4);
    expect(b.select('E|[0,0,1]').length).toEqual(4);
    expect(b.select('E|[1,1,1]')).toEqual(null);

    // Distance Along Axis
    expect(b.select('V>>X').length).toEqual(4);
    
    // Side Selector
    expect(b.select('F||top').area()).toEqual(W*D);
    expect(b.select('E||top').length).toEqual(4);
    const vr = new Edge().makeLine([0,0],[100,100])
                .select('V||right') as Vertex;
    expect(vr.toArray()).toEqual([100,100,0]);
    // Side with 1D Bbox
    expect((new Edge().makeLine([0,0],[100,0]).select('V||right') as Vertex).toArray()).toEqual([100,0,0]);
    expect(new Edge().makeLine([0,0],[100,0]).select('V||top').length).toEqual(2);
    

})


//// MAIN ////





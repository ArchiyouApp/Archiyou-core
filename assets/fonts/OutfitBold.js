﻿/**
 *  Bytestring of TTF file
 *  for converting: https://peckconsulting.s3.amazonaws.com/fontconverter/fontconverter.html
 *  Way of work: Download woff2 of single style from Google Fonts (get from include script) 
 *  and convert to TTF with https://www.fontconverter.io/en/woff2-to-ttf
 *  
 *  Some conversions result in not working TTF files within jsPDF!
 * 
 */

export const OutfitBoldByteString = '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AC8ATwB1AHQAZgBpAHQAaQBvAC8ATwB1AHQAZgBpAHQALQBGAG8AbgB0AHMAKQAAAAIAAAAAAAD/nAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAApgAAACQAyQECAQMBBAEFACYA/QD/AQYAJwEHAQgAKAEJAQoBCwEMACoA+AENAQ4BDwAsARAA+gERARIALQAuARMALwEUARUBFgDiADEBFwEYARkBGgAyARsBHAA1AR0BHgEfADYBIADkAPsBIQEiADcBIwEkADgBJQEmAScBKAEpADoBKgErASwBLQA8AS4AuwEvAD0BMADmATEARAEyATMBNAE1AEYA/gEAATYARwE3AQEASAE4ATkBOgE7AEoA+QE8AT0BPgBMANcBPwFAAUEATQFCAE4BQwBPAUQBRQFGAOMAUQFHAUgBSQFKAFIBSwFMAFUBTQFOAU8AVgFQAOUA/AFRAFcBUgFTAFgBVAFVAVYBVwFYAFoBWQFaAVsBXABcAV0BXgBdAV8A5wFgABABYQFiAWMBZAFlAWYBZwFoAWkBagFrAWwBbQFuBkFicmV2ZQd1bmkwMUNEB0FtYWNyb24HQW9nb25lawpDZG90YWNjZW50BkRjYXJvbgZEY3JvYXQGRWNhcm9uCkVkb3RhY2NlbnQHRW1hY3JvbgdFb2dvbmVrB3VuaTAxMjIKR2RvdGFjY2VudARIYmFyAklKB0ltYWNyb24HSW9nb25lawd1bmkwMTM2BkxhY3V0ZQZMY2Fyb24HdW5pMDEzQgZOYWN1dGUGTmNhcm9uB3VuaTAxNDUDRW5nDU9odW5nYXJ1bWxhdXQHT21hY3JvbgZSYWN1dGUGUmNhcm9uB3VuaTAxNTYGU2FjdXRlB3VuaTAyMTgHdW5pMUU5RQZUY2Fyb24HdW5pMDIxQQZVYnJldmUNVWh1bmdhcnVtbGF1dAdVbWFjcm9uB1VvZ29uZWsFVXJpbmcGV2FjdXRlC1djaXJjdW1mbGV4CVdkaWVyZXNpcwZXZ3JhdmULWWNpcmN1bWZsZXgGWWdyYXZlBlphY3V0ZQpaZG90YWNjZW50BmFicmV2ZQd1bmkwMUNFB2FtYWNyb24HYW9nb25lawpjZG90YWNjZW50BmRjYXJvbgZlY2Fyb24KZWRvdGFjY2VudAdlbWFjcm9uB2VvZ29uZWsHdW5pMDEyMwpnZG90YWNjZW50BGhiYXICaWoHaW1hY3Jvbgdpb2dvbmVrB3VuaTAyMzcHdW5pMDEzNwZsYWN1dGUGbGNhcm9uB3VuaTAxM0MGbmFjdXRlBm5jYXJvbgd1bmkwMTQ2A2VuZw1vaHVuZ2FydW1sYXV0B29tYWNyb24GcmFjdXRlBnJjYXJvbgd1bmkwMTU3BnNhY3V0ZQd1bmkwMjE5BnRjYXJvbgd1bmkwMjFCBnVicmV2ZQ11aHVuZ2FydW1sYXV0B3VtYWNyb24HdW9nb25lawV1cmluZwZ3YWN1dGULd2NpcmN1bWZsZXgJd2RpZXJlc2lzBndncmF2ZQt5Y2lyY3VtZmxleAZ5Z3JhdmUGemFjdXRlCnpkb3RhY2NlbnQHdW5pMDMwOAd1bmkwMzA3CWdyYXZlY29tYglhY3V0ZWNvbWILdW5pMDMwQy5hbHQHdW5pMDMwMgd1bmkwMzA2B3VuaTAzMEEJdGlsZGVjb21iB3VuaTAzMDQHdW5pMDMyNgd1bmkwMzI3B3VuaTAzMjgXRGNyb2F0LkJSQUNLRVQudmFyQWx0MDEAuAH/hbAEjQA=';
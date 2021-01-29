// export class University{

import { LatLng, Point } from "leaflet";

//     constructor( 
//         public id: number, 
//         public name: string, 
//         public location: {
//             coordinates: [longitud:number, latitud:number], 
//             type: string
//         } 
//     ){
        
//     }
// }

export interface Enlace{
    id: number, 
    name: string, 
    description: string, 
    createdAt: string,
    initPoint: LatLng,
    endPoint: LatLng, 
    type: string,
    priority: number,
    nameEntities: string
}
// export class University{

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

export interface University{
    id: number, 
    name: string, 
    location: {
        coordinates: number[], 
        type: string
    }, 
    created_by?: number, 
    created_at: string, 
}
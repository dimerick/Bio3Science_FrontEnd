import { Layer } from 'leaflet';

export class LayerMap{

    constructor(
        public id: number, 
        public name: string,        
        public layer: Layer
        
    ){
        
    }
}
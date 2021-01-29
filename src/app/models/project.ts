import { University } from './university';
import { User } from './user';
import { Community } from './community';
import { Image } from './image';


export interface Project{
    id: number, 
    name: string, 
    description: string, 
    created_by: number, 
    created_at: string, 
    main_university: number, 
    users?:User[], 
    universities?:University[], 
    communities?:Community[], 
    images?:Image[], 
    name_uni: string, 
    universities_network?:any[], 
    communities_network?:any[],
    lat?: number, 
    long?: number,
    nodes_universities?:any[], 
    nodes_communities?:any[],
    universidad?: string,
    user_name?: string, 
    user_last_name?:string
}

export interface EntitiesProject{ 
    users?:User[], 
    universities?:University[], 
    communities?:Community[]  
}
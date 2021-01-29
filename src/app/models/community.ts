export interface Community{
    id: number, 
    name: string, 
    location: {
        coordinates: number[], 
        type: string
    }, 
    created_by: number, 
    created_at: string, 
}
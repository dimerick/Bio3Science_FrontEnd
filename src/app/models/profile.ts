export interface Profile {

    user: number,
    degree: number,
    field_of_study: number,
    description: string,
    websites?: string,
    university?: number,
    ind_researcher?: boolean,
    location?: {
        coordinates: number[],
        type: string
    }
}
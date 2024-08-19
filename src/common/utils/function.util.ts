export const createSlug = (str : string) => {
    return str.replace('','').replace(/[\s]+/g, '_') 
}

export const randomId = () => Math.random().toString(36).substring(2)
export interface SignUser {
    identifier: string;
    password:string;
}

export interface LoginResponse {
    code : number;
    message : string;
    token ?: string;
}
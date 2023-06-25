export interface SignUser {
    identifier: string;
    password:string;
}

export interface LoginResponse {
    code : number;
    message : string;
    token ?: string;
}


export interface ProfileResponse {
    code : number;
    message : string;
    me?: ProfileMe
}

export interface ProfileMe {
    firstName : string;
    lastName : string;
    dateOfBirth : string;
    phoneNumber : string;
    identityNumber : string;
}

export interface MarketsResponse {
    marketCode : string;
    currentQuote : string;
    change24h : string;
    change24hPercent: string;
    highestQuote24h: string;
    lowestQuote24h: string;
    // weightedAverage24h:string;
    // volume24h:string;
    // notionalVolume24h:string;
    // ask:string;
    // bid:string;
}
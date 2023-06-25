export interface SignUser {
    identifier: string;
    password: string;
}

export interface GeneralI {
    code: number;
    message: string;
}

export interface LoginResponse extends GeneralI {
    token?: string;
}

export interface ProfileResponse extends GeneralI {
    me?: ProfileMe
}

export interface ProfileMe {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    identityNumber: string;
}

export interface MarketsResponse {
    marketCode: string;
    currentQuote: string;
    change24h: string;
    change24hPercent: string;
    highestQuote24h: string;
    lowestQuote24h: string;
}

export interface Balances {
    assetCode : string;
    availableAmount : number;
    availableAmountTRYValue : number;
    assetLogo?: string; 
}

export interface BalancesResponse extends GeneralI {
    balances?: Balances[]
}

export interface OpenOrders {
    marketCode:string;
    orderSide:string;
    orderDate:string;
    price:number;
    orderAmount:number;
    fillAmount:number;
    fillPercent:number;
}

export interface OpenOrdersResponse extends GeneralI {
    openOrders?: OpenOrders[]
}
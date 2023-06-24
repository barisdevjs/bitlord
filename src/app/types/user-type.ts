export interface SignUser {
    identifier: string;
    password:string;
}

export interface LoginResponse {
    code : number;
    message : string;
    token ?: string;
}

// {
//     "code": 0,
//     "message": "Auth success",
//     "me": {
//       "firstName": "Elon",
//       "lastName": "Musk",
//       "dateOfBirth": "1971-06-28",
//       "phoneNumber": "+905320000001",
//       "identityNumber": "12345678901"
//     }
//   }

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
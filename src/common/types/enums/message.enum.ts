export enum BadRequestMessage {
    InvalidLoginData="sent data for login are not valid",
    InvalidRegisterData="sent data for registeration are not valid"
}

export enum AuthMessage {
    NotFoundAccount="account did not found",
    AlreadyExistAccount="username already exists",
    ExpiredCode="code is expired. try again later",
    TryAgain="plesae try again in another time",
    NotTrueCode="code is not true"
}

export enum NotFoundMessage {

}

export enum ValidationMessage {

}

export enum PublicMessage {
    CodeSent="code sent succesfully",
    LoggedIn="welcome"
}
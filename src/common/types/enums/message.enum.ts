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
    NotFoundCategory="category not found",
    NotFoundPost="post not found",
    NotFoundUser="user not found",
}

export enum ValidationMessage {

}

export enum PublicMessage {
    CodeSent="code sent succesfully",
    LoggedIn="welcome",
    Created="craeted successfully",
    Deleted="deleted suuccessfully",
    Updated="updated suuccessfully",
    Inserted="inserted suuccessfully",
}

export enum ConflictMessage {
    CategoryTitle="category title already exists"
}
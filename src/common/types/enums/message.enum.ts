export enum BadRequestMessage {
    InvalidLoginData="sent data for login are not valid",
    InvalidRegisterData="sent data for registeration are not valid",
    SomethingWentWrong="something went wrong. try again later",
    InvalidCategories="add correct categories"
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
    NotFound="not found"
}

export enum ValidationMessage {
    InvalidImageFormat="image format ust be jpg, png or jpeg",
    InvalidEmail="invalid email format",
    InvalidPhone="invalid phone format"
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
    CategoryTitle="category title already exists",
    Email="this email is using by someone else",
    Phone="this phone number is using by someone else",
    Username="this username is using by someone else"
}
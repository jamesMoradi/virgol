namespace NodeJS {
    interface ProcessEnv {
        //application
        PORT : number
        
        //database
        DB_PORT : Number
        DB_NAME : String
        DB_USERNAME : String
        DB_PASSWORD : String
        DB_HOST : String
    
        //secrets
        COOKIE_SECRET : string
        OTP_TOKEN_SECRET : string
        ACCESS_TOKEN_SECRET : string
        PHONE_TOKEN_SECRET : string
        EMAIL_TOKEN_SECRET : string
    }
}
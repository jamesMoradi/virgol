namespace NodeJS {
    interface ProcessEnv {
        //application
        PORT : number
        DOMAIN : string
        
        //database
        DB_PORT : Number
        DB_NAME : string
        DB_USERNAME : string
        DB_PASSWORD : string
        DB_HOST : string
    
        //secrets
        COOKIE_SECRET : string
        OTP_TOKEN_SECRET : string
        ACCESS_TOKEN_SECRET : string
        PHONE_TOKEN_SECRET : string
        EMAIL_TOKEN_SECRET : string

        //sms
        SEND_SMS_URL : string
    }
}
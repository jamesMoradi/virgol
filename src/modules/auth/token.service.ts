import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload, CookiePayload, EmailTokenPayload, PhoneTokenPayload } from "./types/payload";
import { AuthMessage, BadRequestMessage } from "src/common/types/enums/message.enum";

@Injectable()
export class TokenServices {
    constructor(private readonly jwtService : JwtService){}

    createOtpToken(payload : CookiePayload){
        const token = this.jwtService.sign(payload,{
            secret : process.env.OTP_TOKEN_SECRET,
            expiresIn : 60 * 2
        })

        return token
    }

    verifyOtpToken(token : string):CookiePayload {
        try {
            const payload = this.jwtService.verify(token,{secret : process.env.OTP_TOKEN_SECRET})
            return payload
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.TryAgain)
        }
    }

    createAccessToken(payload : AccessTokenPayload) {
        const token = this.jwtService.sign(payload, {
            secret : process.env.ACCESS_TOKEN_SECRET,
            expiresIn : '1y'
        })

        return token
    }

    verifyAccessToken(token : string) {
        try {
            const payload = this.jwtService.verify(token, {secret : process.env.ACCESS_TOKEN_SECRET})        
            return payload    
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.TryAgain)
        }
    }

    createEmailToken(payload : EmailTokenPayload) {
        const token = this.jwtService.sign(payload, {
            secret : process.env.EMAIL_TOKEN_SECRET,
            expiresIn : 60 * 2
        })

        return token
    }

    verifyEmailToken(token : string) {
        try {
            const payload = this.jwtService.verify(token, {secret : process.env.EMAIL_TOKEN_SECRET})        
            return payload    
        } catch (error) {
            throw new BadRequestException(BadRequestMessage.SomethingWentWrong)
        }
    }

    createPhoneToken(payload : PhoneTokenPayload) {
        const token = this.jwtService.sign(payload, {
            secret : process.env.PHONE_TOKEN_SECRET,
            expiresIn : 60 * 2
        })

        return token
    }

    verifyPhoneToken(token : string) {
        try {
            const payload = this.jwtService.verify(token, {secret : process.env.PHONE_TOKEN_SECRET})        
            return payload    
        } catch (error) {
            throw new BadRequestException(BadRequestMessage.SomethingWentWrong)
        }
    }
}
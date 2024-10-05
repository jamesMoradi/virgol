import { Injectable, NestMiddleware, Next, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/modules/auth/auth.service";
import { AuthMessage } from "../types/enums/message.enum";
import { isJWT } from "class-validator";

@Injectable()
export class addUserToReqWOV implements NestMiddleware{    
    constructor(
        private readonly authService : AuthService
    ){}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = await this.extractToken(req)
        if (!token) return null

        try {
            let user = await this.authService.validateAccessToken(token)
            if (user) req.user = user
        } catch (error) {
            console.log(error);
            
        }
    
        next()
    }

    protected async extractToken(request : Request){
        const {authorization} = request.headers
        if(!authorization || authorization.trim() === '') 
            return null

        const [bearer, token] = authorization.split(" ")
        if (bearer.toLowerCase() !== 'bearer' ||!token || !isJWT(token)) {
            return null
        }
        
        return token
    }
}
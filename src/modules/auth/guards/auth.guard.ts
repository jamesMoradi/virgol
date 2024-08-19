import { CanActivate,ExecutionContext,Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthMessage } from "src/common/types/enums/message.enum";
import { AuthService } from "../auth.service";
import { Reflector } from "@nestjs/core";
import { Skip_Auth } from "src/common/decorator/skip-auth.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService : AuthService,
        private readonly reflector : Reflector
    ){}

    async canActivate(context: ExecutionContext) {
        const isSipedAuthorization = this.reflector.get<boolean>(Skip_Auth, context.getHandler())
        if (isSipedAuthorization) return true
        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<Request>()
        const token = await this.extractToken(request)
        const payload = await this.authService.validateAccessToken(token)
        request.user = payload
        if (payload) return true

        return false
    }

    protected async extractToken(request : Request){
        const {authorization} = request.headers
        if(!authorization || authorization.trim() === '') 
            throw new UnauthorizedException(AuthMessage.TryAgain)

        const [bearer, token] = authorization.split(" ")
        if (bearer.toLowerCase() !== 'bearer' ||!token || !isJWT(token)) {
            throw new UnauthorizedException(AuthMessage.TryAgain)
        }
        
        return token
    }
}
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { ROLE_KEY } from "src/common/decorator/role.decorator";
import { Roles } from "src/common/types/enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private readonly reflector : Reflector){}

    canActivate(context: ExecutionContext) {
        const reqiuredRoles = this.reflector.getAllAndOverride<Roles[]>(
            ROLE_KEY, 
            [
            context.getHandler(),
            context.getClass()
        ])

        if (!reqiuredRoles || reqiuredRoles.length === 0) return true

        const req:Request = context.switchToHttp().getRequest<Request>()
        const user = req.user
        const userRole = user.role ?? Roles.User

        if (user.role === Roles.Admin) return true
        if (reqiuredRoles.includes(userRole as Roles)) return true

        throw new ForbiddenException()
    }
}
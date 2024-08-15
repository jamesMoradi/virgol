import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { ProfileEntity } from '../user/entity/profile.entity';
import { AuthMessage, BadRequestMessage, PublicMessage } from 'src/common/types/enums/message.enum';
import { OtpEntity } from '../user/entity/otp.entity';
import { randomInt } from 'crypto';
import { TokenServices } from './token.service';
import { Request, Response } from 'express';
import { CookieKeys } from 'src/common/types/enums/cookie.enum';
import { Result } from './types/result';
import { REQUEST } from '@nestjs/core';
import { tokenOption } from 'src/common/utils/cookie.util';

@Injectable({scope : Scope.REQUEST})
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,

        @InjectRepository(ProfileEntity)
        private readonly profileRepository : Repository<ProfileEntity>,

        @InjectRepository(OtpEntity)
        private readonly otpRepository : Repository<OtpEntity>,

        private readonly tokenService : TokenServices,

        @Inject(REQUEST) 
        private  readonly request : Request 
    ){}

    async userExistence(authDto : AuthDto, res : Response){
        const {method, type, username} = authDto
        let result:Result;
        switch (type) {
            case AuthType.Login:
                result = await this.login(method, username)
                return this.sendResponse(res, result)

            case AuthType.Register:
                result = await this.register(method, username)
                return this.sendResponse(res, result)

            default:
                throw new UnauthorizedException()
        }
    }

    async login(method : AuthMethod, username : string){
        const validUser = this.usernameValidator(method, username)
        const user:UserEntity = await this.checkExistence(method, validUser)
        if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount)       
        const otp = await this.saveOtp(user.id, method)
        
        const token = this.tokenService.createOtpToken({userId : user.id})

        return {
            code : otp.code,
            token,
        }
    }

    async register(method : AuthMethod, username : string) {
        const validUser = this.usernameValidator(method, username)
        let user:UserEntity = await this.checkExistence(method, validUser)
        
        if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount)
        if (method === AuthMethod.Username) {
            throw new BadRequestException(BadRequestMessage.InvalidRegisterData)
        }
        user = this.userRepository.create({
            [method] : username
        })
        user = await this.userRepository.save(user)
        
        user.username = `m_${user.id}`
        user = await this.userRepository.save(user)
        
        const otp = await this.saveOtp(user.id, method)
        const token = this.tokenService.createOtpToken({userId : user.id})

        return {
            token : token,
            code : otp.code
        }
    }

    async validateAccessToken(token:string) {
        const {userId} = this.tokenService.verifyAccessToken(token)
        const user = await this.userRepository.findOneBy({id : userId})
        if (!user) throw new UnauthorizedException(AuthMessage.TryAgain)

        return user
    }

    private async sendResponse(res : Response, result : Result) {
        const {token, code} = result
        res.cookie(CookieKeys.Otp, token, tokenOption())
        res.json({
            code : code
        })
    }

    async checkOtp(code : string){
        const token = this.request.cookies?.[CookieKeys.Otp]
        if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode)

        const {userId} = this.tokenService.verifyOtpToken(token)
        const otp = await this.otpRepository.findOneBy({userId})
        if (!otp) throw new UnauthorizedException(AuthMessage.TryAgain)
        
        const now = new Date()
        if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode)
        if (otp.code !== code) throw new UnauthorizedException(AuthMessage.NotTrueCode)
        
        const accesToken = this.tokenService.createAccessToken({userId})

        if (otp.method === AuthMethod.Email) {
            await this.userRepository.update({id : userId}, {
                verifyEmail : true
            })
        } else if (otp.method === AuthMethod.Email) {
            await this.userRepository.update({id : userId}, {
                verifyPhone : true
            })
        }

        return {
            message : PublicMessage.LoggedIn,
            accesToken
        }
        
    }
    
    async saveOtp(userId : number,method : AuthMethod){
        const code = randomInt(10000, 99999).toString()
        const expiresIn = new Date(Date.now() + (1000 * 60 * 2))
        let otp = await this.otpRepository.findOneBy({userId})
        let existOtp = false

        if (otp) {
            existOtp = true
            otp.code = code
            otp.expiresIn = expiresIn,
            otp.method = method
        } else {
            otp = this.otpRepository.create({
                code,
                expiresIn,
                userId,
                method
            })
        }
        otp = await this.otpRepository.save(otp)
        if (!existOtp) {
            await this.userRepository.update({id : userId},{otpId : otp.id})
        }
        return otp
    }

    private usernameValidator (method : AuthMethod, username : string) {
        switch (method) {
            case AuthMethod.Email:
                if (isEmail(username)) return username
                throw new BadRequestException("email format is not correct")
                
            case AuthMethod.Phone :
                if (isMobilePhone(username, 'fa-IR')) return username
                throw new BadRequestException("phone format is not correct")

            case AuthMethod.Username :
                return username

            default:
                throw new UnauthorizedException("username data is not valid")
        }
    }

    private async checkExistence (method : AuthMethod, username : string) {        
        let user:UserEntity;
        if (method === AuthMethod.Phone) {
            user = await this.userRepository.findOneBy({phone : username})
            
        } else if(method === AuthMethod.Email) {
            user = await this.userRepository.findOneBy({email : username})
        } else if (method === AuthMethod.Username) {
            user = await this.userRepository.findOneBy({username : username})
        } else {
            throw new BadRequestException(BadRequestMessage.InvalidLoginData)
        }
        
        return user
    }
}

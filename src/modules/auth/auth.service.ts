import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone, isPhoneNumber } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { ProfileEntity } from '../user/entity/profile.entity';
import { AuthMessage, BadRequestMessage } from 'src/common/types/enums/message.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,

        @InjectRepository(ProfileEntity)
        private readonly profileRepository : Repository<ProfileEntity>
    ){}

    userExistence(authDto : AuthDto){
        const {method, type, username} = authDto
        
        switch (type) {
            case AuthType.Login:
                return this.login(method, username)
        
            case AuthType.Register:
                return this.register(method, username)

            default:
                throw new UnauthorizedException()
        }
    }

    async login(method : AuthMethod, username : string){
        const validUser = this.usernameValidator(method, username)
        const user = await this.checkExistence(method, validUser)
        if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount)
    }

    async register(method : AuthMethod, username : string) {
        const validUser = this.usernameValidator(method, username)
        const user = await this.checkExistence(method, validUser)
        if (!user) throw new ConflictException(AuthMessage.AlreadyExistAccount)
    }

    private async checkOtp(){}
    private async sendOtp(){}

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

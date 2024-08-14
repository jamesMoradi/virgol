import { ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';
import { ConflictMessage, PublicMessage } from 'src/common/types/enums/message.enum';
import { AuthService } from '../auth/auth.service';
import { TokenServices } from '../auth/token.service';

@Injectable({scope : Scope.REQUEST})
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,

        @InjectRepository(ProfileEntity)
        private readonly profileRepository : Repository<ProfileEntity>,

        private readonly authService : AuthService,
        private readonly tokenService : TokenServices,
        @Inject(REQUEST) private readonly req : Request,

    ){}

    async changeProfile(files : ProfileImages, ProfileDto : ProfileDto) {
        if (files.profile_image.length > 0) {
            let [image] = files.profile_image
            ProfileDto.profile_image = image.path.slice(7)
        }

        if(files.bg_image.length > 0) {
            let [image] = files.bg_image
            ProfileDto.bg_image = image.path.slice(7)
        }


        const {id : userId, profileId} = this.req.user
        const {bio,birthday,gender,linkedin_profile,nick_name,x_profile, bg_image, profile_image} = ProfileDto
        let profile = await this.profileRepository.findOneBy({userId})
        if (profile) {
            if (bio) profile.bio = bio
            if (nick_name) profile.nick_name = nick_name
            if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday)
            if (x_profile) profile.x_profile = x_profile
            if (linkedin_profile) profile.linkedin_profile = linkedin_profile
            if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender 
            if (profile_image) profile.profile_image = profile_image
            if (bg_image) profile.bg_image = bg_image
        } else {
            profile = this.profileRepository.create({
                bio,
                birthday, 
                gender,
                linkedin_profile,
                nick_name,
                x_profile,
                userId,
                bg_image,
                profile_image
            })
        }

        profile = await this.profileRepository.save(profile)
        if (!profileId) await this.userRepository.update({id : userId}, {profileId : profile.id})
        
        return {
            message : "data updated"
        }
    }

    async getProfile(){
        const {id} = this.req.user
        return this.userRepository.findOne({
            where : {id},
            relations : ['profile']
        })
    }

    async changeEmail(email : string){
        const {id} = this.req.user
        const user = await this.userRepository.findOneBy({email})
        
        if (user && user.id !== id) {
            throw new ConflictException(ConflictMessage.Email)
        } else if (user.id === id) {
            return {
                message : PublicMessage.Updated
            }
        }
        user.newEmail = email
        const otp = await this.authService.saveOtp(user.id)
        const token = this.tokenService.createEmailToken({email})

        return {
            code : otp.code,
            token
        }
    }
}

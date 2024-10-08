import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Entity, Repository } from 'typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';
import { AuthMessage, BadRequestMessage, ConflictMessage, NotFoundMessage, PublicMessage } from 'src/common/types/enums/message.enum';
import { AuthService } from '../auth/auth.service';
import { TokenServices } from '../auth/token.service';
import { OtpEntity } from './entity/otp.entity';
import { CookieKeys } from 'src/common/types/enums/cookie.enum';
import { AuthMethod } from '../auth/enums/method.enum';
import { FollowEntity } from './entity/follow.entity';
import { EntityNames } from 'src/common/types/enums/entity.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable({scope : Scope.REQUEST})
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,

        @InjectRepository(ProfileEntity)
        private readonly profileRepository : Repository<ProfileEntity>,

        @InjectRepository(OtpEntity)
        private readonly otpRepository : Repository<OtpEntity>,

        @InjectRepository(FollowEntity)
        private readonly followRepository : Repository<FollowEntity>,

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
        return this.userRepository.createQueryBuilder(EntityNames.User)
        .where({id})
        .leftJoinAndSelect('user.profile', 'profile')
        .loadRelationCountAndMap('user.followers', 'user.followers')
        .loadRelationCountAndMap('user.following', 'user.following')
        .getOne()
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
        await this.userRepository.update({id},{newEmail : email})
        const otp = await this.authService.saveOtp(id, AuthMethod.Email)
        const token = this.tokenService.createEmailToken({email})

        return {
            code : otp.code,
            token
        }
    }

    async verifyEmail(code : string){
        const {id: userId, newEmail} = this.req.user
        const token = this.req.cookies?.[CookieKeys.EmailOtp]
        if (!token) throw new BadRequestException(AuthMessage.ExpiredCode)
        
        const {email} = this.tokenService.verifyEmailToken(token)
        if(email !== newEmail) 
            throw new BadRequestException(BadRequestMessage.SomethingWentWrong)
        
        const otp = await this.checkOtp(userId, code)
        if (otp.method !== AuthMethod.Email) 
            throw new BadRequestException(BadRequestMessage.SomethingWentWrong)

        await this.userRepository.update({id : userId}, {
            email,
            verifyEmail : true,
            newEmail : null
        })

        return {
            message : PublicMessage.Updated
        }
    }

    async checkOtp(userId : number, code : string){
        const otp = await this.otpRepository.findOneBy({userId})
        const now = new Date()
        if (!otp) throw new BadRequestException(NotFoundMessage.NotFound)
        if (otp.expiresIn < now) throw new BadRequestException(AuthMessage.ExpiredCode)
        if (otp.code !== code) throw new BadRequestException(AuthMessage.NotTrueCode)
        return otp
    }

    async changePhone(phone : string){
        const {id} = this.req.user
        const user = await this.userRepository.findOneBy({phone})
        
        if (user && user.id !== id) {
            throw new ConflictException(ConflictMessage.Phone)
        } else if (user.id === id) {
            return {
                message : PublicMessage.Updated
            }
        }
        await this.userRepository.update({id},{newPhone : phone})
        const otp = await this.authService.saveOtp(id, AuthMethod.Phone)
        const token = this.tokenService.createPhoneToken({phone})

        return {
            code : otp.code,
            token
        }
    } 
 
    async verifyPhone(code : string){
        const {id: userId, newPhone} = this.req.user
        const token = this.req.cookies?.[CookieKeys.PhoneOtp]
        if (!token) throw new BadRequestException(AuthMessage.ExpiredCode)
        
        const {phone} = this.tokenService.verifyPhoneToken(token)
        if(phone !== newPhone) 
            throw new BadRequestException(BadRequestMessage.SomethingWentWrong)
        
        const otp = await this.checkOtp(userId, code)
        if (otp.method !== AuthMethod.Phone) 
            throw new BadRequestException(BadRequestMessage.SomethingWentWrong)

        await this.userRepository.update({id : userId}, {
            phone,
            verifyPhone : true,
            newPhone : null
        })

        return {
            message : PublicMessage.Updated
        }
    }

    async changeUsername(username : string){
        const {id} = this.req.user
        const user = await this.userRepository.findOneBy({username})

        if (user && user.id !== id) {
            throw new ConflictException(ConflictMessage.Phone)
        } else if(user.id === id) {
            return {
                message : PublicMessage.Updated
            }
        }

        await this.userRepository.update({id}, {newUsername : username})
        return {
            message : PublicMessage.Updated
        }
    }

    async followToggle (followingId : number) {
        const {id : userId} = this.req.user
        const following = await this.userRepository.findOneBy({id : userId})
        if(!following) throw new NotFoundException(NotFoundMessage.NotFoundUser)

        const isFollowing = await this.followRepository.findOneBy({followingId, followerId : userId})
        let message:string ;

        if (isFollowing) {
            await this.followRepository.remove(isFollowing) 
            message = PublicMessage.Unfollowed
        } else {
            await this.followRepository.insert({followingId, followerId : userId})
            message = PublicMessage.Followed
        }

        return {
            message
        }
    }

    async getFollowers(paginationDto : PaginationDto){
        const {limit, page, skip} = paginationSolver(paginationDto)
        const {id : userId} = this.req.user
        const [followers, count] = await this.followRepository.findAndCount({
            where : {followingId : userId},
            relations : {followers : {profile : true}},
            select : {
                id : true,
                followers : {
                    id : true,
                    profile : {
                        id : true,
                        bio : true,
                        nick_name : true,
                        profile_image : true
                    }
                }
            },
            skip,
            take : limit
        })

        return {
            pagination : paginationGenerator(count ,page, limit),
            followers
        }
    }

    async getFollowings(paginationDto : PaginationDto){
        const {limit, page, skip} = paginationSolver(paginationDto)
        const {id : userId} = this.req.user
        const [following, count] = await this.followRepository.findAndCount({
            where : {followerId : userId},
            relations : {following : {profile : true}},
            select : {
                id : true,
                following : {
                    id : true,
                    profile : {
                        id : true,
                        bio : true,
                        nick_name : true,
                        profile_image : true
                    }
                }
            },
            skip,
            take : limit
        })

        return {
            pagination : paginationGenerator(count ,page, limit),
            following
        }
    }
}

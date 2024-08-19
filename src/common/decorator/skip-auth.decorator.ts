import { SetMetadata } from "@nestjs/common"

export const Skip_Auth = 'SKIP-AUTH'
export const SkipAuth = () => SetMetadata(Skip_Auth, true)
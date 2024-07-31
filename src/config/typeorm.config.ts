import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const TypeOrmConfig = () : TypeOrmModuleOptions => {
    const {DB_NAME, DB_PORT, DB_HOST, DB_PASSWORD, DB_USERNAME} = process.env

    return {
        type : 'postgres',
        host : DB_HOST,
        port : +DB_PORT,
        database : DB_NAME,
        username : DB_USERNAME,
        password : DB_PASSWORD,
        autoLoadEntities : false,
        synchronize : false,
        entities : []
    }
}
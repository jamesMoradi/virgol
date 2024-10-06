import { Global, Module } from "@nestjs/common";
import { SMSService } from "./SMS.service";
import { HttpModule } from "@nestjs/axios";

@Global()
@Module({
    imports : [HttpModule.register({
        timeout : 1000
    })],
    providers : [SMSService],
    exports : [SMSService]
})
export class CustomHttpModule {}
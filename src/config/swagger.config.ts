import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const swaggerConfigInit = (app:INestApplication):void => {
    const document = new DocumentBuilder()
    .setTitle("Virgol")
    .setDescription("Back-End of Virgol Website")
    .setVersion("v0.0.1")
    .addBearerAuth(SwaggerAuthConfig(),'Authorization')
    .build()

    const swaggerDocument = SwaggerModule.createDocument(app,document)
    SwaggerModule.setup('/swagger', app, swaggerDocument)
}

export const SwaggerAuthConfig = ():SecuritySchemeObject => {
    return {
        type : "http",
        bearerFormat : "JWT",
        in : "bearer",
        scheme : "bearer"
    }
}
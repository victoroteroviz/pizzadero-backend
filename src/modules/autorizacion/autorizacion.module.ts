import { Module } from '@nestjs/common';
import { AutorizacionService } from './autorizacion.service';
import { AutorizacionController } from './autorizacion.controller';

//Handler de encriptacion
import { BcryptHandler } from '../../common/helpers/encriptacion/bcrypt.handler';

//+ Hanlder de Querruner
import { QueryRunnerManagerHelper } from '../../common/handlers/queryRunner/queryRunner-manager.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AutorizacionController],
  providers: [AutorizacionService, BcryptHandler, QueryRunnerManagerHelper],
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          issuer: configService.get<string>('JWT_ISSUER'),
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
})
export class AutorizacionModule {}

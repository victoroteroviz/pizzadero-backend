import { Module } from '@nestjs/common';
import { AutorizacionService } from './autorizacion.service';
import { AutorizacionController } from './autorizacion.controller';

//Handler de encriptacion
import { BcryptHandler } from '../../common/helpers/encriptacion/bcrypt.handler';

@Module({
  controllers: [AutorizacionController],
  providers: [AutorizacionService, BcryptHandler],
})
export class AutorizacionModule {}

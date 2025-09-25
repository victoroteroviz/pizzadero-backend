import { Body, Controller, Post } from '@nestjs/common';

//+ Servicios
import { AutorizacionService } from './autorizacion.service';

//+ Interfaces
import { IniciarSesionResponse } from './interfaces/iniciar-sesion.interface';

//+ DTOs
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
@Controller('autorizacion')
export class AutorizacionController {
  constructor(private readonly autorizacionService: AutorizacionService) {}

  @Post('iniciar-sesion')
  async iniciarSesion(
    @Body() iniciarSesionDto: IniciarSesionDto,
  ): Promise<IniciarSesionResponse> {
    return this.autorizacionService.iniciarSesion(iniciarSesionDto);
  }
}

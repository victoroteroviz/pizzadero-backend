import { Body, Controller, Post } from '@nestjs/common';

//+ Servicios
import { AutorizacionService } from './autorizacion.service';

//+ Interfaces
import { IniciarSesionResponse } from './interfaces/iniciar-sesion.interface';
import { CerrarSesionResponse } from './interfaces/cerrar-sesion.interface';
//+ DTOs
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { CerrarSesionDto } from './dto/cerrar-sesion.dto';
@Controller('autorizacion')
export class AutorizacionController {
  constructor(private readonly autorizacionService: AutorizacionService) {}

  @Post('iniciar-sesion')
  async iniciarSesion(
    @Body() iniciarSesionDto: IniciarSesionDto,
  ): Promise<IniciarSesionResponse> {
    return this.autorizacionService.iniciarSesion(iniciarSesionDto);
  }

  @Post('cerrar-sesion')
  async cerrarSesion(
    @Body() cerrarSesionDto: CerrarSesionDto,
  ): Promise<CerrarSesionResponse> {
    return this.autorizacionService.cerrarSesion(cerrarSesionDto);
  }
}

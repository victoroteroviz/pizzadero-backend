//+ Importaciones de NestJS
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

//+ DTOs
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { CerrarSesionDto } from './dto/cerrar-sesion.dto';

//+ Interfaces
import { IniciarSesionResponse } from './interfaces/iniciar-sesion.interface';

//+ TypeORM
import { DataSource, QueryRunner } from 'typeorm';
import { SesionEntity } from 'src/entities';

//+ Handlers
import { BcryptHandler } from '../../common/helpers/encriptacion/bcrypt.handler';

@Injectable()
export class AutorizacionService {
  constructor(private readonly dataSource: DataSource) {}

  async iniciarSesion(iniciarSesionDto: IniciarSesionDto) {
    // : Promise<IniciarSesionResponse>
    const { correo, contrasena } = iniciarSesionDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const sesion: SesionEntity = await queryRunner.manager.findOneOrFail(
        SesionEntity,
        {
          where: { correo },
        },
      );

      if (!sesion.estaActivo) {
        throw new UnauthorizedException(
          'El usuario ya tiene una sesión abiera',
        );
      }

      const sesionPrecarga: SesionEntity | undefined =
        await queryRunner.manager.preload(SesionEntity, {
          id: sesion.idSesion,
          sesionAbierta: true,
        });

      if (!sesionPrecarga) {
        throw new InternalServerErrorException(
          'Error al iniciar sesión, intente nuevamente',
        );
      }

      await queryRunner.manager.save(SesionEntity, sesionPrecarga);

      const respuesta: IniciarSesionResponse = {
        status: 'success',
        message: 'Inicio de sesión exitoso',
        token: 'token_de_ejemplo',
      };
      await queryRunner.commitTransaction();
      return respuesta;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      //
      throw new Error('Hola');
    } finally {
      await queryRunner.release();
    }
  }

  private async obtenerUsuario(
    correo: string,
    contrasena: string,
    queryRunner: QueryRunner,
  ) {}
}

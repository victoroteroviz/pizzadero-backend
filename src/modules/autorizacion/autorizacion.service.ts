//+ Importaciones de NestJS
import { Injectable, InternalServerErrorException } from '@nestjs/common';

//+ DTOs
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { CerrarSesionDto } from './dto/cerrar-sesion.dto';

import { IniciarSesionResponse } from './interfaces/iniciar-sesion.interface';

//+ TypeORM
import { DataSource, QueryRunner } from 'typeorm';
import { SesionEntity } from 'src/entities';

@Injectable()
export class AutorizacionService {
  constructor(private readonly dataSource: DataSource) {}

  async iniciarSesion(
    iniciarSesionDto: IniciarSesionDto,
  ): Promise<IniciarSesionResponse> {
    const { correo, contrasena } = iniciarSesionDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const usuario = await queryRunner.manager
        .createQueryBuilder()
        .select('s')
        .from('sesion', 's')
        .where('s.correo = :correo', { correo })
        .getOne();

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      const sesion: SesionEntity = await queryRunner.manager.findOneOrFail(
        SesionEntity,
        {
          where: { correo },
        },
      );
      

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

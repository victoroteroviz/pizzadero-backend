//TODO Crear validacion de fecha para intentos de inicio de sesion

//+ Importaciones de NestJS
import {
  Logger,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

//+ DTOs
import { IniciarSesionDto } from './dto/iniciar-sesion.dto';
import { CerrarSesionDto } from './dto/cerrar-sesion.dto';

//+ Interfaces
import { IniciarSesionResponse } from './interfaces/iniciar-sesion.interface';
import { CerrarSesionResponse } from './interfaces/cerrar-sesion.interface';
//+ TypeORM
import { DataSource, QueryRunner } from 'typeorm';
import { SesionEntity } from 'src/entities';

//+ Handlers
import { BcryptHandler } from '../../common/helpers/encriptacion/bcrypt.handler';
import { QueryRunnerManagerHelper } from '../../common/handlers/queryRunner/queryRunner-manager.handler';
//+ Hander de Exepciones
import { HandlerPostgresError } from '../../common/handlers/postgres/postgres-exception.handler';

@Injectable()
export class AutorizacionService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly queryRunnerManager: QueryRunnerManagerHelper,
    private readonly bcryptHandler: BcryptHandler,
  ) {}
  private readonly logger: Logger = new Logger(AutorizacionService.name);

  async iniciarSesion(
    iniciarSesionDto: IniciarSesionDto,
  ): Promise<IniciarSesionResponse> {
    const { correo, contrasena } = iniciarSesionDto;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.log('Iniciando proceso de inicio de sesión');
      const sesion: SesionEntity = await queryRunner.manager.findOneOrFail(
        SesionEntity,
        {
          where: { correo },
        },
      );

      this.logger.debug('Sesion encontrada: ', sesion);

      if (!sesion.estaActivo) {
        throw new UnauthorizedException('El usuario no está activo');
      }

      if (sesion.sesionAbierta) {
        throw new UnauthorizedException(
          'El usuario ya tiene una sesión abierta',
        );
      }

      if (
        !(await this.bcryptHandler.comparePasswords(
          contrasena,
          sesion.contrasena,
        ))
      ) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const sesionPrecarga: SesionEntity | undefined =
        await queryRunner.manager.preload(SesionEntity, {
          idSesion: sesion.idSesion,
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
        token: 'token a implementar',
      };
      await queryRunner.commitTransaction();
      return respuesta;
    } catch (error) {
      this.logger.debug('Error capturado: ', error);
      this.logger.error(
        'Error en el proceso de inicio de sesión',
        error.message,
      );
      if (this.queryRunnerManager.needsClosure(queryRunner)) {
        await this.queryRunnerManager.rollbackAndClose(queryRunner);
      }
      //
      throw new HandlerPostgresError(error);
    } finally {
      this.logger.log('Se finaliza el proceso de inicio de sesión');
      if (this.queryRunnerManager.needsClosure(queryRunner)) {
        await this.queryRunnerManager.safeClose(queryRunner);
      }
    }
  }

  async cerrarSesion(
    cerrarSesionDto: CerrarSesionDto,
  ): Promise<CerrarSesionResponse> {
    const { correo } = cerrarSesionDto;

    this.logger.log('Iniciando proceso de cierre de sesión');
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
      this.logger.debug('Correo recibido: ', correo);
      this.logger.debug('Sesion encontrada: ', sesion);

      if (!sesion.estaActivo) {
        throw new UnauthorizedException('El usuario no está activo');
      }

      if (!sesion.sesionAbierta) {
        throw new ConflictException('El usuario no tiene una sesión abierta');
      }

      const sesionPrecarga: SesionEntity | undefined =
        await queryRunner.manager.preload(SesionEntity, {
          idSesion: sesion.idSesion,
          sesionAbierta: false,
        });

      if (!sesionPrecarga) {
        throw new InternalServerErrorException(
          'Error al cerrar sesión, intente nuevamente',
        );
      }

      await queryRunner.manager.save(SesionEntity, sesionPrecarga);

      const respuesta = {
        status: true,
        message: 'Cierre de sesión exitoso',
      };
      await queryRunner.commitTransaction();
      return respuesta;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.debug('Error capturado: ', error);
      this.logger.error(
        'Error en el proceso de cierre de sesión',
        error.message,
      );
      if (this.queryRunnerManager.needsClosure(queryRunner)) {
        await this.queryRunnerManager.rollbackAndClose(queryRunner);
      }
      throw new HandlerPostgresError(error);
    } finally {
      this.logger.log('Se finaliza el proceso de cierre de sesión');
      if (this.queryRunnerManager.needsClosure(queryRunner)) {
        await this.queryRunnerManager.safeClose(queryRunner);
      }
    }
  }
}

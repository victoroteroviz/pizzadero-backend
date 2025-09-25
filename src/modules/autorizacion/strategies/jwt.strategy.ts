//+ Dependencias de NestJS
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';

//+ Dependencias de TypeORM
import { DataSource, QueryRunner, In } from 'typeorm';
//+ Dependencias de Passport y JWT
import { Strategy, ExtractJwt } from 'passport-jwt';
//+ Interfaces
import { JwtPayload } from '../interfaces/jwt-payload.interface';

//+ Entidades
import { UsuarioEntity } from '../../../entities';
import { PrivilegioEntity } from '../../../entities';
import { SesionEntity } from '../../../entities';

//+ Handlers de errores
import { HandlerPostgresError } from '../../../common/handlers/postgres/postgres-exception.handler';

//+ Handler
import { QueryRunnerManagerHelper } from '../../../common/handlers/queryRunner/queryRunner-manager.handler';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly queryRunnerManagerHelper: QueryRunnerManagerHelper,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    super({
      secretOrKey:
        typeof jwtSecret === 'string' ? jwtSecret : 'randomSecret123',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const sesionEntity: SesionEntity =
        await queryRunner.manager.findOneOrFail(SesionEntity, {
          where: {
            idSesion: id,
          },
          select: {
            usuario: true,
            idSesion: true,
          },
          relations: ['usuario', 'usuario.privilegios'],
        });
      if (!sesionEntity || !sesionEntity.estaActivo) {
        throw new UnauthorizedException('Sesión inválida o inactiva');
      }
      sesionEntity.contrasena = '';

      return {
        id: sesionEntity.idSesion,
        roles: sesionEntity.usuario.privilegio.titulo,
      };
    } catch (error) {
      this.logger.error('Error al validar el token JWT', error);
      if (this.queryRunnerManagerHelper.needsClosure(queryRunner)) {
        await this.queryRunnerManagerHelper.rollbackAndClose(queryRunner);
      }
      throw new HandlerPostgresError(error);
    } finally {
      if (this.queryRunnerManagerHelper.needsClosure(queryRunner)) {
        await this.queryRunnerManagerHelper.safeClose(queryRunner);
      }
    }
  }
}

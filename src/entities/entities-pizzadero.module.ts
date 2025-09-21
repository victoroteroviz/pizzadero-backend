import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//+ Entidades de usuario y sesión
import { UsuarioEntity } from './usuario/usuario.entity';
import { SesionEntity } from './usuario/sesion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    //* Entidades de usuario y sesión
    UsuarioEntity, SesionEntity])],
})
export class EntitiesPizzaderoModule {}

import { Module } from '@nestjs/common';
import { EntitiesPizzaderoModule } from './entities/entities-pizzadero.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import process from 'process';
@Module({
  imports: [
    EntitiesPizzaderoModule,
    ConfigModule.forRoot(),
    //Modulo para la conexion a la base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Desactivar en producción
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

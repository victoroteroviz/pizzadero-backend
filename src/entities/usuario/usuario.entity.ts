import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SesionEntity } from './sesion.entity';

@Entity('usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
    comment: 'Nombre del usuario',
    name: 'nombre',
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Apellido materno del usuario',
    name: 'apellido_m',
  })
  apellidoM: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Apellido paterno del usuario',
    name: 'apellido_p',
  })
  apellidoP: string;

  @CreateDateColumn()
  fechaRegistro: Date;
  @UpdateDateColumn()
  fechaActualizacion: Date;
  @DeleteDateColumn()
  fechaEliminacion: Date;
  @Column({
    type: 'timestamp',
    nullable: false,
    comment: 'Fecha de nacimiento del usuario',
    name: 'fecha_nacimiento',
  })
  fechaNacimiento: Date;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Género del usuario',
    name: 'genero',
  })
  genero: string;

  //#region R Sesion
  @OneToOne(() => SesionEntity, (sesion) => sesion.usuario)
  sesion: SesionEntity;
  //#endregion
}

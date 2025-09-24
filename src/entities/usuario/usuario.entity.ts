import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SesionEntity } from './sesion.entity';
import { DireccionUsuario } from './direccion-usuario.entity';
import { TelefonoEntity } from './telefono.entity';
import { PrivilegioEntity } from '../privilegio/privilegio.entity';
import { PedidoEntity } from '../pedidos/pedido.entity';

@Entity('usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_usuario',
  })
  idUsuario: string;

  @Column({
    type: 'varchar',
    length: 100,
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

  @CreateDateColumn({
    name: 'fecha_creacion',
  })
  fechaRegistro: Date;
  @UpdateDateColumn({
    name: 'fecha_actualizacion',
  })
  fechaActualizacion: Date;
  @DeleteDateColumn({
    name: 'fecha_eliminacion',
  })
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

  //#region R Direcciones
  // Relación uno a muchos con DireccionUsuario
  @OneToMany(() => DireccionUsuario, (direccion) => direccion.usuario)
  direcciones: DireccionUsuario[];
  //#endregion

  //#region R Telefonos
  @OneToMany(() => TelefonoEntity, (telefono) => telefono.usuario, {
    cascade: true,
  })
  telefonos: TelefonoEntity[];
  //#endregion

  //#region R Privilegio
  @ManyToOne(() => PrivilegioEntity, (privilegio) => privilegio.usuario)
  @JoinColumn({ name: 'id_privilegio' })
  privilegio: PrivilegioEntity;
  //#endregion

  //#region R Pedidos
  @OneToMany(() => PedidoEntity, (pedido) => pedido.usuario)
  pedido: PedidoEntity[];
  //#endregion
}

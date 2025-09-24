//+ TypeORM
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

//+ Entidades
import { UsuarioEntity } from './usuario.entity';
import { PedidoEntity } from '../pedidos/pedido.entity';

@Entity('direccion_usuario')
export class DireccionUsuario {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_direccion',
  })
  idDireccion: string;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'colonia',
    comment: 'colonia de usuario',
  })
  colonia: string;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Calle de usuario',
    name: 'calle',
  })
  calle: string;
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    name: 'numero_exterior',
    comment: 'Número exterior de usuario',
  })
  numeroExterior: string;
  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    name: 'numero_interior',
    comment: 'Número interior de usuario',
  })
  numeroInterior?: string | undefined;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'tipo_domicilio',
    comment: 'Tipo de domicilio de usuario',
  })
  tipoDomicilio: string;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'referencia',
    comment: 'Referencia de la dirección del usuario',
  })
  referencia: string;

  //#region Auditoria
  @Column({
    type: 'boolean',
    default: true,
    name: 'activo',
    comment: 'Indica si el registro está activo o inactivo',
  })
  activo: boolean;
  @CreateDateColumn({
    name: 'fecha_creacion',
  })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_actualizacion',
  })
  fechaActualizacion: Date;
  @DeleteDateColumn({
    name: 'fecha_eliminacion',
  })
  fechaEliminacion: Date;
  //#endregion

  //#region Relacion con Usuario
  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.direcciones, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: UsuarioEntity;
  //#endregion

  //#region Relación con Pedido
  @OneToOne(() => PedidoEntity, (pedido) => pedido.direccionUsuario, {
    nullable: true,
  })
  pedido: PedidoEntity;
}

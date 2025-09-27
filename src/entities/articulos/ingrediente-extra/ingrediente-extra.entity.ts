import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PedidoArticuloExtraEntity } from './pedido-articulo-extra.entity';

@Entity('ingrediente_extra')
export class IngredienteExtraEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_ingrediente_extra',
  })
  idIngredienteExtra: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'nombre',
    comment: 'Nombre del ingrediente extra',
  })
  nombre: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'precio',
    comment: 'Precio del ingrediente extra',
  })
  precio: number;

  @Column({
    type: 'boolean',
    default: true,
    name: 'esta_activo',
    comment: 'Indica si el ingrediente extra está activo o no',
  })
  activo: boolean;

  //#region Auditoria
  @Column({
    type: 'boolean',
    default: false,
    name: 'eliminado',
    comment: 'Indica si el registro está activo o inactivo',
  })
  eliminado: boolean;
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;
  //#endregion

  //#region R Pedido Articulo Extra
  @OneToMany(
    () => PedidoArticuloExtraEntity,
    (pedidoArticuloExtra) => pedidoArticuloExtra.ingredienteExtra,
  )
  pedidoArticuloExtras: PedidoArticuloExtraEntity[];
  //#endregion
}

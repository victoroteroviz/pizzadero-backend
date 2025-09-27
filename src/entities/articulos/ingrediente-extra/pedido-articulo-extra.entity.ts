import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IngredienteExtraEntity } from './ingrediente-extra.entity';
import { ArticuloEntity } from '../articulo.entity';

@Entity('pedido_articulo_extra')
export class PedidoArticuloExtraEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_pedido_articulo_extra',
  })
  idPedidoArticuloExtra: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'cantidad',
    comment: 'Cantidad del ingrediente extra en el pedido',
  })
  cantidad: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'precio_unitario',
    comment: 'Precio unitario del ingrediente extra en el pedido',
  })
  precioUnitario: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'subtotal',
    comment: 'Subtotal del ingrediente extra en el pedido',
  })
  subtotal: number;

  //#region Auditoría
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  eliminado: boolean;
  //#endregion

  //#region R ingrediente Extra
  @ManyToOne(
    () => IngredienteExtraEntity,
    (ingredienteExtra) => ingredienteExtra.pedidoArticuloExtras,
  )
  ingredienteExtra: IngredienteExtraEntity;
  //#endregion

  //#region R Pedido Articulo
  @ManyToOne(() => ArticuloEntity, (articulo) => articulo.pedidoArticuloExtra)
  articuloEntity: ArticuloEntity;
  //#endregion
}

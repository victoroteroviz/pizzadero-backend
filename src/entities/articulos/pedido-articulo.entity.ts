import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PedidoEntity } from '../pedidos/pedido.entity';
import { ArticuloEntity } from './articulo.entity';

@Entity('pedido_articulo')
export class PedidoArticuloEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_pedido_articulo',
  })
  idPedidoArticulo: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'cantidad',
    comment: 'Cantidad del artículo en el pedido',
  })
  cantidad: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'precio_unitario',
    comment: 'Precio unitario del artículo en el pedido',
  })
  precioUnitario: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'subtotal',
    comment: 'Subtotal del artículo en el pedido',
  })
  subtotal: number;
  @Column({
    type: 'text',
    nullable: true,
    name: 'nota_extra',
    comment: 'Nota extra para el artículo en el pedido',
  })
  notaExtra?: string | null;

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

  // #region R Pedidos Mto1
  @ManyToOne(() => PedidoEntity, (pedido) => pedido.pedidoArticulo)
  @JoinColumn({ name: 'id_pedido' })
  pedido: PedidoEntity;
  //#endregion

  // #region R Articulos Mto1
  @ManyToOne(() => ArticuloEntity, (articulo) => articulo.pedidoArticulo)
  @JoinColumn({ name: 'id_articulo' })
  articulo: ArticuloEntity;
  //#endregion
}

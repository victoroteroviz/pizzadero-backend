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
import { UsuarioEntity } from '../usuario/usuario.entity';
import { DireccionUsuario } from '../usuario/direccion-usuario.entity';
import { TelefonoEntity } from '../usuario/telefono.entity';
import { TipoPedidoEntity } from './tipo-pedido.entity';
import { MetodoPagoEntity } from './metodo-pago.entity';
import { EstadoPedidoEntity } from './estado-pedido.entity';
import { PedidoArticuloEntity } from '../articulos/pedido-articulo.entity';

@Entity('pedido')
export class PedidoEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_pedido',
  })
  idPedido: string;
  @Column({
    name: 'numero_pedido',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  numeroPedido: string;
  @Column({
    name: 'subtotal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  subtotal: number;
  @Column({
    name: 'impuesto',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  impuesto: number;
  @Column({
    name: 'descuento',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  descuento: number;
  @Column({
    name: 'propina',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  propina: number;
  @Column({
    name: 'total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  total: number;

  @Column({
    name: 'nota_especial',
    type: 'text',
    nullable: true,
  })
  notaEspecial: string;
  @Column({
    name: 'fecha_pedido',
    type: 'timestamp',
    nullable: false,
  })
  fechaPedido: Date;

  @Column({
    name: 'fecha_entrega',
    type: 'timestamp',
    nullable: true,
  })
  fechaEntrega: Date;

  @Column({
    name: 'fecha_cancelacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaCancelacion: Date;
  @Column({
    name: 'fecha_entrega_real',
    type: 'timestamp',
    nullable: true,
  })
  fechaEntregaReal: Date;

  //#region Auditoria
  @Column({
    name: 'eliminado',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  eliminado: boolean;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
    nullable: false,
  })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_actualizacion',
    type: 'timestamp',
    nullable: false,
  })
  fechaActualizacion: Date;

  @DeleteDateColumn({
    name: 'fecha_eliminacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaEliminacion: Date;
  //#endregion

  //#region R Usuario
  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.pedido, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: UsuarioEntity;
  //#endregion

  //#region R Direccion
  @OneToOne(() => DireccionUsuario, (direccion) => direccion.pedido)
  @JoinColumn({ name: 'id_direccion' })
  direccionUsuario: DireccionUsuario;
  //#endregion

  //#region R Telefono
  @OneToOne(() => TelefonoEntity, (telefono) => telefono.pedido)
  @JoinColumn({ name: 'id_telefono' })
  telefono: TelefonoEntity;
  //#endregion

  //#region R TipoPedido
  @ManyToOne(() => TipoPedidoEntity, (tipoPedido) => tipoPedido.pedido, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_tipo_pedido' })
  tipoPedido: TipoPedidoEntity;
  //#endregion

  //#region R MetodoPago
  @ManyToOne(() => MetodoPagoEntity, (metodoPago) => metodoPago.pedido, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_metodo_pago' })
  metodoPago: MetodoPagoEntity;
  //#endregion

  //#region R EstadoPedido
  @ManyToOne(() => EstadoPedidoEntity, (estadoPedido) => estadoPedido.pedido, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_estado_pedido' })
  estadoPedido: EstadoPedidoEntity;
  //#endregion

  //#region R PedidoArticulo
  @OneToMany(
    () => PedidoArticuloEntity,
    (pedidoArticulo) => pedidoArticulo.pedido,
  )
  pedidoArticulo: PedidoArticuloEntity[];
  //#endregion
}

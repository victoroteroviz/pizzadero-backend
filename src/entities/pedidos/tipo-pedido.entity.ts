import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PedidoEntity } from './pedido.entity';

@Entity('tipo_pedido')
export class TipoPedidoEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_tipo_pedido',
  })
  idTipoPedido: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  titulo: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  descripcion: string;

  //#region Auditoria
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

  //#region R Pedidos
  @OneToMany(() => PedidoEntity, (pedido) => pedido.tipoPedido)
  pedido: PedidoEntity[];
  //#endregion
}

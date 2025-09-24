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

@Entity('metodo_pago')
export class MetodoPagoEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_metodo_pago',
  })
  idMetodoPago: string;

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
  @OneToMany(() => PedidoEntity, (pedido) => pedido.metodoPago)
  pedido: PedidoEntity[];
  //#endregion
}

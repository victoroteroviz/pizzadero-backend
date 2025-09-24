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

import { UsuarioEntity } from './usuario.entity';
import { PedidoEntity } from '../pedidos/pedido.entity';
import { ClienteChatEntity } from '../chat/cliente-chat.entity';

@Entity('telefono')
export class TelefonoEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_telefono',
  })
  idTelefono: number;
  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    unique: true,
    comment: 'Número de teléfono del usuario',
    name: 'telefono',
  })
  telefono: string;
  //#region Auditoría
  @CreateDateColumn()
  fechaCreacion: Date;
  @UpdateDateColumn()
  fechaActualizacion: Date;
  @DeleteDateColumn()
  fechaEliminacion: Date;
  @Column({
    type: 'boolean',
    default: false,
    name: 'eliminado',
    comment: 'Indica si el registro ha sido eliminado lógicamente',
  })
  eliminado: boolean;
  //#endregion
  @Column({
    type: 'boolean',
    default: true,
    name: 'activo',
    comment: 'Indica si el registro está activo o inactivo',
  })
  activo: boolean;

  //#region R Usuario
  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.telefonos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: UsuarioEntity;
  //#endregion

  //#region R Pedido
  @OneToOne(() => PedidoEntity, (pedido) => pedido.telefono, {
    nullable: true,
  })
  pedido: PedidoEntity;
  //#endregion
  //#region R Cliente Chat
  @ManyToOne(() => ClienteChatEntity, (clienteChat) => clienteChat.telefono, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_cliente_chat' })
  clienteChat: ClienteChatEntity;
}

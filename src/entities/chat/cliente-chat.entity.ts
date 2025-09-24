import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TelefonoEntity } from '../usuario/telefono.entity';
import { HistorialChatEntity } from './historial-chat.entity';

@Entity('cliente_chat')
export class ClienteChatEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_cliente_chat',
  })
  idClienteChat: string;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: false,
    comment: 'Identificador del cliente en el sistema de chat',
    name: 'nombre',
  })
  nombreCliente: string;

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

  //#region R telefono
  @OneToMany(() => TelefonoEntity, (telefono) => telefono.clienteChat, {
    nullable: true,
  })
  telefono: TelefonoEntity[];
  //#endregion

  //#region R historial chat
  @ManyToOne(
    () => HistorialChatEntity,
    (historialChat) => historialChat.clienteChat,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'id_telefono' })
  historialChats: HistorialChatEntity;
  //#endregion
}

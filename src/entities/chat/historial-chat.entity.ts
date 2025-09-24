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
import { ClienteChatEntity } from './cliente-chat.entity';
import { IaChatEntity } from './ia-chat.entity';
import { ChatEntity } from './chat.entity';

@Entity('historial_chat')
export class HistorialChatEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_historial_chat',
  })
  idHistorialChat: string;

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

  //#region R cliente chat
  @ManyToOne(
    () => ClienteChatEntity,
    (clienteChat) => clienteChat.historialChats,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'id_cliente_chat' })
  clienteChat: ClienteChatEntity;
  //#endregion

  //#region R IA chat
  @ManyToOne(() => IaChatEntity, (iaChat) => iaChat.historialChats, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_ia_chat' })
  iaChat: IaChatEntity;
  //#endregion

  //#region R chat
  @OneToMany(() => ChatEntity, (chat) => chat.historialChats, {
    nullable: true,
  })
  chat: ChatEntity[];
  //#endregion
}

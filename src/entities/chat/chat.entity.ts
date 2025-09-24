import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HistorialChatEntity } from './historial-chat.entity';

@Entity('chat')
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_chat',
  })
  idChat: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: false,
    name: 'nombre',
  })
  nombre: string;
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

  //#region R historial chat
  @OneToMany(() => HistorialChatEntity, (historialChat) => historialChat.chat)
  historialChats: HistorialChatEntity[];
  //#endregion
}

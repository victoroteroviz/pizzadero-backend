import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsuarioEntity } from './usuario.entity';

@Entity('sesion')
export class SesionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
    comment: 'Correo electrónico del usuario',
    name: 'correo',
  })
  correo: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Contraseña encriptada',
    name: 'contrasena',
  })
  contrasena: string;

  @Column({
    type: 'int',
    default: 0,
    name: 'intento_fallido',
    comment: ' Este sera el numero de intentos fallidos de inicio de sesion',
  })
  intentoFallido: number;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si la sesión está activa o no',
    name: 'esta_activo',
  })
  estaActivo: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se usa para saber si hay sesion abierta',
  })
  sesionAbierta: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha y hora de la última sesión',
    name: 'ultima_sesion',
  })
  ultimaSesion: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha y hora de expiración de la sesión',
    name: 'expira_sesion',
  })
  expiraSesion: Date;

  @CreateDateColumn({})
  fechaCreacion: Date;

  @UpdateDateColumn({})
  fechaActualizacion: Date;

  //#region R Usuario
  @OneToOne(() => UsuarioEntity, (usuario) => usuario.sesion)
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Entity('privilegio')
export class PrivilegioEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_privilegio',
  })
  idPrivilegio: string;

  @Column({
    name: 'titulo',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  titulo: string;
  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  descripcion: string;

  //#region Auditoria
  @Column({
    name: 'activo',
    type: 'boolean',
    default: true,
  })
  activo: boolean;

  @CreateDateColumn({
    name: 'fecha_creacion',
  })
  fechaCreacion: Date;
  @UpdateDateColumn({
    name: 'fecha_actualizacion',
  })
  fechaActualizacion: Date;

  @DeleteDateColumn({
    name: 'fecha_eliminacion',
  })
  fechaEliminacion: Date;
  //#endregion

  //#region R Usuario
  @OneToMany(() => UsuarioEntity, (usuario) => usuario.privilegio)
  usuario: UsuarioEntity[];
}

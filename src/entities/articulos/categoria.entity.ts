import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticuloEntity } from './articulo.entity';

@Entity('categoria')
export class CategoriaEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_categoria',
  })
  idCategoria: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'nombre',
    comment: 'Nombre de la categoría',
  })
  nombre: string;

  @Column({
    type: 'text',
    nullable: false,
    name: 'descripcion',
    comment: 'Descripción de la categoría',
  })
  descripcion: string;

  @Column({
    type: 'boolean',
    default: true,
    name: 'esta_activo',
    comment: 'Indica si la categoría está activa o no',
  })
  activo: boolean;

  //#region Auditoria
  @Column({
    type: 'boolean',
    default: false,
    name: 'eliminado',
    comment: 'Indica si el registro está activo o inactivo',
  })
  eliminado: boolean;
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;
  //#endregion

  //#region R Articulo
  @OneToMany(() => ArticuloEntity, (articulo) => articulo.categoria)
  articulos: ArticuloEntity[];
  //#endregion
}

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
import { PedidoArticuloEntity } from './pedido-articulo.entity';
import { CategoriaEntity } from './categoria.entity';

@Entity('articulo')
export class ArticuloEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_articulo',
  })
  idArticulo: string;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'nombre',
    comment: 'Nombre del artículo',
  })
  nombre: string;
  @Column({
    type: 'text',
    nullable: false,
    name: 'descripcion',
    comment: 'Descripción del artículo',
  })
  descripcion: string;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'precio',
    comment: 'Precio del artículo',
  })
  precio: number;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'tamano',
    comment: 'Tamaño del artículo',
  })
  tamano: string;
  @Column({
    type: 'text',
    nullable: false,
    name: 'imagen',
    comment: 'URL de la imagen del artículo',
  })
  imagen: string;
  @Column({
    type: 'int',
    nullable: false,
    name: 'tiempo_preparacion',
    comment: 'Tiempo de preparación del artículo en minutos',
  })
  tiempoPreparacion: number;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'sku',
    comment: 'SKU del artículo',
  })
  sku: string;
  @Column({
    type: 'boolean',
    nullable: true,
    name: 'disponible',
    comment: 'Disponibilidad del artículo',
  })
  disponible: boolean;

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

  //#region R PedidoArticulo
  @OneToMany(
    () => PedidoArticuloEntity,
    (pedidoArticulo) => pedidoArticulo.articulo,
  )
  pedidoArticulo: PedidoArticuloEntity[];
  //#endregion

  //#region R Categoria
  @ManyToOne(() => CategoriaEntity, (categoria) => categoria.articulos)
  @JoinColumn({ name: 'id_categoria' })
  categoria: CategoriaEntity;
  //#endregion
}

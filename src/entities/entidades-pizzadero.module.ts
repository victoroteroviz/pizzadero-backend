import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//+ Entidades de usuario
import { UsuarioEntity } from './usuario/usuario.entity';
import { SesionEntity } from './usuario/sesion.entity';
import { DireccionUsuario } from './usuario/direccion-usuario.entity';
import { TelefonoEntity } from './usuario/telefono.entity';

//+ Entidades de privilegio
import { PrivilegioEntity } from './privilegio/privilegio.entity';
//+ Entidades de pedidos
import { PedidoEntity } from './pedidos/pedido.entity';
import { TipoPedidoEntity } from './pedidos/tipo-pedido.entity';
import { MetodoPagoEntity } from './pedidos/metodo-pago.entity';
import { EstadoPedidoEntity } from './pedidos/estado-pedido.entity';
//+ Entidades de articulos
import { PedidoArticuloEntity } from './articulos/pedido-articulo.entity';
import { ArticuloEntity } from './articulos/articulo.entity';
import { CategoriaEntity } from './articulos/categoria.entity';
import { ClienteChatEntity } from './chat/cliente-chat.entity';
import { HistorialChatEntity } from './chat/historial-chat.entity';
import { ChatEntity } from './chat/chat.entity';
import { IaChatEntity } from './chat/ia-chat.entity';
import { PedidoArticuloExtraEntity } from './articulos/ingrediente-extra/pedido-articulo-extra.entity';
import { IngredienteExtraEntity } from './articulos/ingrediente-extra/ingrediente-extra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      //* Entidades de usuario
      UsuarioEntity,
      SesionEntity,
      DireccionUsuario,
      TelefonoEntity,
      //* Entidades de privilegio
      PrivilegioEntity,
      //* Entidades de pedidos
      PedidoEntity,
      TipoPedidoEntity,
      MetodoPagoEntity,
      EstadoPedidoEntity,
      //* Entidades de articulos
      PedidoArticuloEntity,
      ArticuloEntity,
      IngredienteExtraEntity,
      PedidoArticuloExtraEntity,
      CategoriaEntity,
      //* Entidades de chat
      ClienteChatEntity,
      IaChatEntity,
      ChatEntity,
      HistorialChatEntity,
    ]),
  ],
})
export class EntitiesPizzaderoModule {}

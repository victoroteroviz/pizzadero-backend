import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class IniciarSesionDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(6, 100)
  correo: string;

  @IsNotEmpty()
  @Length(8, 15)
  contrasena: string;
}

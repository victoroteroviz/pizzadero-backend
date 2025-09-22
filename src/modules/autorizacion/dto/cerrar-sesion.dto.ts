import { IsNotEmpty, IsUUID } from "class-validator";

export class CerrarSesionDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

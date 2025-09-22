import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHandler {
  private readonly logger = new Logger(BcryptHandler.name);

  async hashPassword(password: string): Promise<string> {
    this.logger.debug('Contraseña a hashear: ' + password);
    this.logger.log('Hasheando contraseña');
    if (!password) {
      this.logger.error('La contraseña no puede estar vacía');
      throw new Error('La contraseña no puede estar vacía');
    }
    
    this.logger.log('Hashing contraseña');
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

export enum TransactionAction {
  COMMIT = 'commit',
  ROLLBACK = 'rollback',
  AUTO = 'auto', // Decide automáticamente basado en el estado
}

export interface QueryRunnerStatus {
  isConnected: boolean;
  isTransactionActive: boolean;
  isReleased: boolean;
  connectionIsConnected?: boolean;
}

export interface CloseOptions {
  action?: TransactionAction;
  forceRelease?: boolean;
  timeout?: number; // Timeout en ms para operaciones
  logLevel?: 'verbose' | 'log' | 'warn' | 'error' | 'silent';
}

@Injectable()
export class QueryRunnerManagerHelper {
  private readonly logger = new Logger(QueryRunnerManagerHelper.name);
  private readonly DEFAULT_TIMEOUT = 5000; // 5 segundos

  /**
   * Cierra un QueryRunner de forma segura manejando todos los casos posibles
   * @param queryRunner - El QueryRunner a cerrar
   * @param options - Opciones de cierre
   * @returns Promise<boolean> - true si se cerró correctamente, false si hubo problemas
   */
  async safeClose(
    queryRunner: QueryRunner,
    options: CloseOptions = {},
  ): Promise<boolean> {
    const {
      action = TransactionAction.AUTO,
      forceRelease = true,
      timeout = this.DEFAULT_TIMEOUT,
      logLevel = 'verbose',
    } = options;

    const operationId = this.generateOperationId();

    try {
      this.log(
        `[${operationId}] Iniciando cierre seguro de QueryRunner`,
        logLevel,
      );

      // 1. Obtener estado inicial
      const initialStatus = this.getQueryRunnerStatus(queryRunner);
      this.log(
        `[${operationId}] Estado inicial: ${JSON.stringify(initialStatus)}`,
        logLevel,
      );

      // 2. Validar si el QueryRunner es válido
      if (!this.isValidQueryRunner(queryRunner)) {
        this.log(`[${operationId}] QueryRunner inválido o null`, 'warn');
        return false;
      }

      // 3. Manejar transacción con timeout
      const transactionHandled = await this.handleTransactionWithTimeout(
        queryRunner,
        action,
        timeout,
        operationId,
        logLevel,
      );

      if (!transactionHandled) {
        this.log(`[${operationId}] Error al manejar la transacción`, 'error');
      }

      // 4. Liberar conexión con timeout
      const connectionReleased = await this.releaseConnectionWithTimeout(
        queryRunner,
        forceRelease,
        timeout,
        operationId,
        logLevel,
      );

      // 5. Verificación final
      const finalStatus = this.getQueryRunnerStatus(queryRunner);
      this.log(
        `[${operationId}] Estado final: ${JSON.stringify(finalStatus)}`,
        logLevel,
      );

      const success =
        finalStatus.isReleased && !finalStatus.isTransactionActive;

      if (success) {
        this.log(
          `[${operationId}] ✅ QueryRunner cerrado correctamente`,
          logLevel,
        );
      } else {
        this.log(
          `[${operationId}] ❌ QueryRunner no se cerró completamente`,
          'error',
        );
      }

      return success;
    } catch (error) {
      this.log(
        `[${operationId}] Error crítico en safeClose: ${error.message}`,
        'error',
      );

      // Intento de liberación de emergencia
      if (forceRelease) {
        return await this.emergencyRelease(queryRunner, operationId);
      }

      return false;
    }
  }

  /**
   * Maneja la transacción (commit/rollback) con timeout
   */
  private async handleTransactionWithTimeout(
    queryRunner: QueryRunner,
    action: TransactionAction,
    timeout: number,
    operationId: string,
    logLevel: string,
  ): Promise<boolean> {
    if (!queryRunner.isTransactionActive) {
      this.log(`[${operationId}] No hay transacción activa`, logLevel);
      return true;
    }

    try {
      const transactionAction = this.determineTransactionAction(action);
      this.log(`[${operationId}] Ejecutando ${transactionAction}`, logLevel);

      const transactionPromise =
        transactionAction === 'commit'
          ? queryRunner.commitTransaction()
          : queryRunner.rollbackTransaction();

      await this.withTimeout(
        transactionPromise,
        timeout,
        `${transactionAction} transaction`,
      );

      this.log(`[${operationId}] ✅ ${transactionAction} completado`, logLevel);
      return true;
    } catch (error) {
      this.log(
        `[${operationId}] Error en transacción: ${error.message}`,
        'error',
      );

      // Si el commit falló, intentar rollback
      if (
        action === TransactionAction.COMMIT &&
        queryRunner.isTransactionActive
      ) {
        try {
          await this.withTimeout(
            queryRunner.rollbackTransaction(),
            timeout,
            'emergency rollback',
          );
          this.log(
            `[${operationId}] ✅ Rollback de emergencia completado`,
            'warn',
          );
          return true;
        } catch (rollbackError) {
          this.log(
            `[${operationId}] Error en rollback de emergencia: ${rollbackError.message}`,
            'error',
          );
        }
      }

      return false;
    }
  }

  /**
   * Libera la conexión con timeout
   */
  private async releaseConnectionWithTimeout(
    queryRunner: QueryRunner,
    forceRelease: boolean,
    timeout: number,
    operationId: string,
    logLevel: string,
  ): Promise<boolean> {
    if (queryRunner.isReleased) {
      this.log(`[${operationId}] QueryRunner ya estaba liberado`, logLevel);
      return true;
    }

    try {
      // Verificar si aún hay transacción activa
      if (queryRunner.isTransactionActive) {
        if (forceRelease) {
          this.log(
            `[${operationId}] Forzando rollback antes de liberar`,
            'warn',
          );
          await this.withTimeout(
            queryRunner.rollbackTransaction(),
            timeout,
            'force rollback before release',
          );
        } else {
          this.log(
            `[${operationId}] No se puede liberar: transacción aún activa`,
            'error',
          );
          return false;
        }
      }

      await this.withTimeout(
        queryRunner.release(),
        timeout,
        'release connection',
      );
      this.log(`[${operationId}] ✅ Conexión liberada correctamente`, logLevel);
      return true;
    } catch (error) {
      this.log(
        `[${operationId}] Error al liberar conexión: ${error.message}`,
        'error',
      );
      return false;
    }
  }

  /**
   * Liberación de emergencia cuando todo lo demás falla
   */
  private async emergencyRelease(
    queryRunner: QueryRunner,
    operationId: string,
  ): Promise<boolean> {
    this.log(`[${operationId}] 🚨 Iniciando liberación de emergencia`, 'warn');

    try {
      // Intentar rollback si hay transacción activa
      if (queryRunner.isTransactionActive) {
        try {
          await queryRunner.rollbackTransaction();
          this.log(`[${operationId}] Rollback de emergencia exitoso`, 'warn');
        } catch (rollbackError) {
          this.log(
            `[${operationId}] Rollback de emergencia falló: ${rollbackError.message}`,
            'error',
          );
        }
      }

      // Intentar liberar sin importar el estado
      if (!queryRunner.isReleased) {
        await queryRunner.release();
        this.log(
          `[${operationId}] ✅ Liberación de emergencia exitosa`,
          'warn',
        );
        return true;
      }

      return true;
    } catch (error) {
      this.log(
        `[${operationId}] ❌ Liberación de emergencia falló: ${error.message}`,
        'error',
      );
      return false;
    }
  }

  /**
   * Obtiene el estado completo del QueryRunner
   */
  public getQueryRunnerStatus(queryRunner: QueryRunner): QueryRunnerStatus {
    if (!queryRunner) {
      return {
        isConnected: false,
        isTransactionActive: false,
        isReleased: true,
        connectionIsConnected: false,
      };
    }

    return {
      isConnected: queryRunner.connection?.isInitialized,
      isTransactionActive: queryRunner.isTransactionActive,
      isReleased: queryRunner.isReleased,
      connectionIsConnected: queryRunner.connection?.isInitialized,
    };
  }

  /**
   * Valida si el QueryRunner es válido
   */
  private isValidQueryRunner(queryRunner: QueryRunner): boolean {
    return queryRunner !== null && queryRunner !== undefined;
  }

  /**
   * Determina la acción de transacción a ejecutar
   */
  private determineTransactionAction(
    action: TransactionAction,
  ): 'commit' | 'rollback' {
    switch (action) {
      case TransactionAction.COMMIT:
        return 'commit';
      case TransactionAction.ROLLBACK:
        return 'rollback';
      case TransactionAction.AUTO:
      default:
        return 'rollback'; // Por seguridad, por defecto hacer rollback
    }
  }

  /**
   * Ejecuta una operación con timeout
   */
  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    operationName: string,
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Timeout de ${timeoutMs}ms excedido para: ${operationName}`,
          ),
        );
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Sistema de logging configurable
   */
  private log(message: string, level: string): void {
    if (level === 'silent') return;

    switch (level) {
      case 'verbose':
        this.logger.verbose(message);
        break;
      case 'log':
        this.logger.log(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
      case 'error':
        this.logger.error(message);
        break;
    }
  }

  /**
   * Genera un ID único para la operación
   */
  private generateOperationId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Método de conveniencia para commit y cierre
   */
  async commitAndClose(
    queryRunner: QueryRunner,
    options: Omit<CloseOptions, 'action'> = {},
  ): Promise<boolean> {
    return this.safeClose(queryRunner, {
      ...options,
      action: TransactionAction.COMMIT,
    });
  }

  /**
   * Método de conveniencia para rollback y cierre
   */
  async rollbackAndClose(
    queryRunner: QueryRunner,
    options: Omit<CloseOptions, 'action'> = {},
  ): Promise<boolean> {
    return this.safeClose(queryRunner, {
      ...options,
      action: TransactionAction.ROLLBACK,
    });
  }

  /**
   * Método para verificar si un QueryRunner necesita ser cerrado
   */
  needsClosure(queryRunner: QueryRunner): boolean {
    if (!this.isValidQueryRunner(queryRunner)) return false;
    return !queryRunner.isReleased || queryRunner.isTransactionActive;
  }
}

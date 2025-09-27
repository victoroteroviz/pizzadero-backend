// src/common/helpers/handlePostgresError.ts
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  MethodNotAllowedException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  ImATeapotException,
  GoneException,
} from '@nestjs/common';

interface PostgresError {
  code?: string;
  message?: string;
  detail?: string;
  hint?: string;
  severity?: string;
  constraint?: string;
  table?: string;
  column?: string;
  schema?: string;
  dataType?: string;
  where?: string;
  stack?: string;
}

export class HandlerPostgresError {
  constructor(error: any) {
    // Si ya es una excepción de NestJS conocida, la relanzamos con más detalles
    if (error instanceof BadRequestException) {
      throw new BadRequestException({
        message: error.message || 'Bad Request',
        error: 'Bad Request',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof ConflictException) {
      throw new ConflictException({
        message: error.message || 'Conflict',
        error: 'Conflict',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof NotFoundException) {
      throw new NotFoundException({
        message: error.message || 'Not Found',
        error: 'Not Found',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof InternalServerErrorException) {
      throw new InternalServerErrorException({
        message: error.message || 'Internal Server Error',
        error: 'Internal Server Error',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof ForbiddenException) {
      throw new ForbiddenException({
        message: error.message || 'Forbidden',
        error: 'Forbidden',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof NotAcceptableException) {
      throw new NotAcceptableException({
        message: error.message || 'Not Acceptable',
        error: 'Not Acceptable',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof RequestTimeoutException) {
      throw new RequestTimeoutException({
        message: error.message || 'Request Timeout',
        error: 'Request Timeout',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof PayloadTooLargeException) {
      throw new PayloadTooLargeException({
        message: error.message || 'Payload Too Large',
        error: 'Payload Too Large',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof UnsupportedMediaTypeException) {
      throw new UnsupportedMediaTypeException({
        message: error.message || 'Unsupported Media Type',
        error: 'Unsupported Media Type',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof UnprocessableEntityException) {
      throw new UnprocessableEntityException({
        message: error.message || 'Unprocessable Entity',
        error: 'Unprocessable Entity',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof MethodNotAllowedException) {
      throw new MethodNotAllowedException({
        message: error.message || 'Method Not Allowed',
        error: 'Method Not Allowed',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof NotImplementedException) {
      throw new NotImplementedException({
        message: error.message || 'Not Implemented',
        error: 'Not Implemented',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof BadGatewayException) {
      throw new BadGatewayException({
        message: error.message || 'Bad Gateway',
        error: 'Bad Gateway',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof ServiceUnavailableException) {
      throw new ServiceUnavailableException({
        message: error.message || 'Service Unavailable',
        error: 'Service Unavailable',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof GatewayTimeoutException) {
      throw new GatewayTimeoutException({
        message: error.message || 'Gateway Timeout',
        error: 'Gateway Timeout',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof ImATeapotException) {
      throw new ImATeapotException({
        message: error.message || "I'm a teapot",
        error: "I'm a teapot",
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof UnauthorizedException) {
      throw new UnauthorizedException({
        message: error.message || 'Unauthorized',
        error: 'Unauthorized',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    if (error instanceof GoneException) {
      throw new GoneException({
        message: error.message || 'Gone',
        error: 'Gone',
        details: error.getResponse(),
        timestamp: new Date().toISOString(),
      });
    }

    // Manejo específico de errores de PostgreSQL
    const pgError = error as PostgresError;
    if (pgError.code) {
      switch (pgError.code) {
        case '23505': // Unique violation
          throw new ConflictException({
            message: 'Ya existe un registro con estos datos',
            error: 'Duplicate Entry',
            details: {
              constraint: pgError.constraint,
              table: pgError.table,
              column: pgError.column,
              value: pgError.detail,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '23503': // Foreign key violation
          throw new BadRequestException({
            message:
              'No se puede completar la operación debido a una referencia inexistente',
            error: 'Foreign Key Constraint Failed',
            details: {
              constraint: pgError.constraint,
              table: pgError.table,
              column: pgError.column,
              referencedTable: pgError.schema,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '22P02': // Invalid text representation
          throw new BadRequestException({
            message: 'Formato de datos inválido',
            error: 'Invalid Data Format',
            details: {
              column: pgError.column,
              dataType: pgError.dataType,
              value: pgError.where,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '23514': // Check constraint violation
          throw new BadRequestException({
            message: 'Los datos no cumplen con las reglas de validación',
            error: 'Check Constraint Violation',
            details: {
              constraint: pgError.constraint,
              table: pgError.table,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '23502': // Not null violation
          throw new BadRequestException({
            message: 'Campo requerido faltante',
            error: 'Required Field Missing',
            details: {
              column: pgError.column,
              table: pgError.table,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '42P01': // Undefined table
          throw new InternalServerErrorException({
            message: 'Error de configuración de base de datos',
            error: 'Database Configuration Error',
            details: {
              table: pgError.table,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '42703': // Undefined column
          throw new BadRequestException({
            message: 'Campo especificado no existe',
            error: 'Undefined Column',
            details: {
              column: pgError.column,
              table: pgError.table,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '42883': // Undefined function
          throw new BadRequestException({
            message: 'Función no definida',
            error: 'Undefined Function',
            details: {
              postgresError: pgError.code,
              postgresMessage: pgError.message,
            },
            timestamp: new Date().toISOString(),
          });

        case '22001': // String data right truncation
          throw new BadRequestException({
            message: 'Datos demasiado largos para el campo',
            error: 'String Too Long',
            details: {
              column: pgError.column,
              table: pgError.table,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '22003': // Numeric value out of range
          throw new BadRequestException({
            message: 'Valor numérico fuera de rango',
            error: 'Numeric Value Out Of Range',
            details: {
              column: pgError.column,
              table: pgError.table,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '23001': // Restrict violation
          throw new BadRequestException({
            message: 'No se puede eliminar: existen registros relacionados',
            error: 'Restrict Violation',
            details: {
              constraint: pgError.constraint,
              table: pgError.table,
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '08000': // Connection exception
          throw new ServiceUnavailableException({
            message: 'Error de conexión con la base de datos',
            error: 'Database Connection Error',
            details: {
              postgresError: pgError.code,
              postgresMessage: pgError.message,
            },
            timestamp: new Date().toISOString(),
          });

        case '08003': // Connection does not exist
          throw new ServiceUnavailableException({
            message: 'Conexión con la base de datos no existe',
            error: 'Connection Does Not Exist',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '08006': // Connection failure
          throw new ServiceUnavailableException({
            message: 'Fallo en la conexión con la base de datos',
            error: 'Connection Failure',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '53300': // Too many connections
          throw new ServiceUnavailableException({
            message: 'Demasiadas conexiones a la base de datos',
            error: 'Too Many Connections',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '57014': // Query canceled
          throw new RequestTimeoutException({
            message: 'Consulta cancelada por timeout',
            error: 'Query Canceled',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '42601': // Syntax error
          throw new BadRequestException({
            message: 'Error de sintaxis en la consulta',
            error: 'Syntax Error',
            details: {
              postgresError: pgError.code,
              postgresMessage: pgError.message,
            },
            timestamp: new Date().toISOString(),
          });

        case '42501': // Insufficient privilege
          throw new ForbiddenException({
            message: 'Privilegios insuficientes para esta operación',
            error: 'Insufficient Privilege',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '28000': // Invalid authorization specification
          throw new UnauthorizedException({
            message: 'Especificación de autorización inválida',
            error: 'Invalid Authorization',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '28P01': // Invalid password
          throw new UnauthorizedException({
            message: 'Contraseña inválida',
            error: 'Invalid Password',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '25001': // Active sql transaction
          throw new ConflictException({
            message: 'Ya existe una transacción activa',
            error: 'Active SQL Transaction',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '25P02': // In failed sql transaction
          throw new BadRequestException({
            message: 'Transacción en estado de fallo',
            error: 'Failed SQL Transaction',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '40001': // Serialization failure
          throw new ConflictException({
            message: 'Fallo de serialización - intente nuevamente',
            error: 'Serialization Failure',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        case '40P01': // Deadlock detected
          throw new ConflictException({
            message: 'Deadlock detectado - intente nuevamente',
            error: 'Deadlock Detected',
            details: {
              postgresError: pgError.code,
            },
            timestamp: new Date().toISOString(),
          });

        default:
          throw new InternalServerErrorException({
            message: 'Error interno del servidor',
            error: 'Internal Server Error',
            details: {
              postgresError: pgError.code,
              postgresMessage: pgError.message,
              severity: pgError.severity,
              hint: pgError.hint,
            },
            timestamp: new Date().toISOString(),
          });
      }
    }

    // Para errores no identificados
    throw new InternalServerErrorException({
      message: 'Error interno del servidor',
      error: 'Unhandled Error',
      details: {
        originalError: pgError.message || 'Unknown error',
        stack:
          process.env.NODE_ENV === 'development' ? pgError.stack : undefined,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

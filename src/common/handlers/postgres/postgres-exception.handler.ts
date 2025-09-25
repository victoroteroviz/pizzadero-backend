// src/common/helpers/handlePostgresError.ts
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
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
            message: 'No se puede completar la operación debido a una referencia inexistente',
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
        stack: process.env.NODE_ENV === 'development' ? pgError.stack : undefined,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
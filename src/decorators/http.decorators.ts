import { ErrorDto } from '@/common/dto/error.dto';
import {
  HttpCode,
  HttpStatus,
  type Type,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'http';
import { PaginateConfig, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { Public } from './public.decorator';

type ApiResponseType = number;
type ApiAuthType = 'basic' | 'api-key' | 'jwt';

interface IApiOptions<T extends Type<any>> {
  type?: T;
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
}

interface IApiAuthOptions extends IApiOptions<Type<any>> {
  auths?: ApiAuthType[];
}

export const ApiPublic = (
  options: IApiOptions<Type<any>> = {},
): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];

  const errorResponses = (options.errorResponses || defaultErrorResponses).map(
    (statusCode) =>
      ApiResponse({
        status: statusCode,
        type: ErrorDto,
        description: STATUS_CODES[statusCode],
      }),
  );

  return applyDecorators(
    Public(),
    ApiOperation({ summary: options.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    options.statusCode === HttpStatus.CREATED
      ? ApiCreatedResponse({
          type: options.type,
          description: options.description ?? 'Created',
        })
      : ApiOkResponse({
          type: options.type,
          description: options.description ?? 'OK',
        }),
    ...errorResponses,
  );
};

export const ApiAuth = (options: IApiAuthOptions = {}): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];

  const auths = options.auths || ['jwt'];

  const errorResponses = (options.errorResponses || defaultErrorResponses).map(
    (statusCode) =>
      ApiResponse({
        status: statusCode,
        type: ErrorDto,
        description: STATUS_CODES[statusCode],
      }),
  );

  const authDecorators = auths.map((auth) => {
    switch (auth) {
      case 'basic':
        return ApiBasicAuth();
      case 'api-key':
        return ApiSecurity('Api-Key');
      case 'jwt':
        return ApiBearerAuth();
    }
  });

  return applyDecorators(
    ApiOperation({ summary: options.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    options.statusCode === HttpStatus.CREATED
      ? ApiCreatedResponse({
          type: options.type,
          description: options.description ?? 'Created',
        })
      : ApiOkResponse({
          type: options.type,
          description: options.description ?? 'OK',
        }),
    ...authDecorators,
    ...errorResponses,
  );
};

export const ApiAuthWithPaginate = (
  options: IApiAuthOptions = {},
  paginateOptions?: PaginateConfig<any>,
): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];

  const auths = options.auths || ['jwt'];

  const errorResponses = (options.errorResponses || defaultErrorResponses).map(
    (statusCode) =>
      ApiResponse({
        status: statusCode,
        type: ErrorDto,
        description: STATUS_CODES[statusCode],
      }),
  );

  const authDecorators = auths.map((auth) => {
    switch (auth) {
      case 'basic':
        return ApiBasicAuth();
      case 'api-key':
        return ApiSecurity('Api-Key');
      case 'jwt':
        return ApiBearerAuth();
    }
  });

  return applyDecorators(
    ApiOperation({ summary: options.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    PaginatedSwaggerDocs(options.type, paginateOptions),
    ...authDecorators,
    ...errorResponses,
  );
};

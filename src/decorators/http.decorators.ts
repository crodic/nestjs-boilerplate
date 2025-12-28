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
import { ApiPaginatedResponse } from './swagger.decorators';

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

export const ApiPublicWithPaginate = (
  options: IApiOptions<Type<any>> = {},
  paginateOptions?: PaginateConfig<any>,
) => {
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
    PaginatedSwaggerDocs(options.type, paginateOptions),
    ...errorResponses,
  );
};

// Simple
type PaginationType = 'offset' | 'cursor';

interface ISimpleApiOptions<T extends Type<any>> {
  type?: T;
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
  isPaginated?: boolean;
  paginationType?: PaginationType;
}

type ISimpleApiPublicOptions = ISimpleApiOptions<Type<any>>;

interface ISimpleApiAuthOptions extends ISimpleApiOptions<Type<any>> {
  auths?: ApiAuthType[];
}

export const SimpleApiPublic = (
  options: ISimpleApiPublicOptions = {},
): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];
  const isPaginated = options.isPaginated || false;
  const ok = {
    type: options.type,
    description: options?.description ?? 'OK',
    paginationType: options.paginationType || 'offset',
  };

  const errorResponses = (options.errorResponses || defaultErrorResponses)?.map(
    (statusCode) =>
      ApiResponse({
        status: statusCode,
        type: ErrorDto,
        description: STATUS_CODES[statusCode],
      }),
  );

  return applyDecorators(
    Public(),
    ApiOperation({ summary: options?.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    isPaginated ? ApiPaginatedResponse(ok) : ApiOkResponse(ok),
    ...errorResponses,
  );
};

export const SimpleApiAuth = (
  options: ISimpleApiAuthOptions = {},
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
  const isPaginated = options.isPaginated || false;
  const ok = {
    type: options.type,
    description: options?.description ?? 'OK',
    paginationType: options.paginationType || 'offset',
  };
  const auths = options.auths || ['jwt'];

  const errorResponses = (options.errorResponses || defaultErrorResponses)?.map(
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
    ApiOperation({ summary: options?.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    isPaginated
      ? ApiPaginatedResponse(ok)
      : options.statusCode === 201
        ? ApiCreatedResponse(ok)
        : ApiOkResponse(ok),
    ...authDecorators,
    ...errorResponses,
  );
};

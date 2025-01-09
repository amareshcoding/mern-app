const CONST = {
  CODES: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    ACCESS_DENIED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  },

  MESSAGES: {
    SOMTHING_WENT_WRONG: 'Something went wrong!',
    BAD_REQUEST: 'Bad Request',
    ACCESS_DENIED: 'Access Denied',
    INVALID_TOKEN: 'Invalid Token',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    NOT_IMPLEMENTED: 'Not Implemented',
    BAD_GATEWAY: 'Bad Gateway',
    SERVICE_UNAVAILABLE: 'Service Unavailable',
  },
};

export const { CODES, MESSAGES } = CONST;

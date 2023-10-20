export class UnauthorizedError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = statusCode;
      }
}

export class ConflictError extends Error{
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}
class UserError extends Error {
  constructor(
    public errorCode: string,
    errorMessage: string,
    public statusCode: number
  ) {
    super(errorMessage);
  }
}

export { UserError };

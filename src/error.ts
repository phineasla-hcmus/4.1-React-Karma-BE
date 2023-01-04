export interface ResponseError {
  errorId: string;
  message: string;
  details?: [{ [key: string]: any }];
}

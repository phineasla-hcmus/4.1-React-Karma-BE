export interface CreateExternalTransactionDto {
  internal: string;
  external: string;
  bank: string;
  amount: number;
  message: string;
}

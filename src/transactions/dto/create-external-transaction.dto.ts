export interface CreateExternalTransactionDto {
  internal: string;
  external: string;
  bank: string;
  amount: number;
  fee: number;
  message: string;
}

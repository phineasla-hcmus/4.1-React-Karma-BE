import { FeeType } from '../../types';

export interface CreateTransactionDto {
  sender: string;
  receiver: string;
  amount: number;
  message: string;
  fee: number;
  feeType: FeeType;
}

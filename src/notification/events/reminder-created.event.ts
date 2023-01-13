export interface ReminderCreatedEvent {
  senderId: number;
  senderName: string;
  receiverId: number;
  amount: number;
}

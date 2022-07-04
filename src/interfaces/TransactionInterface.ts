export interface TransactionInterface {
  ticker: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  openDate: Date;
  historyItemID: string;
}

export interface TransactionBodyInterface {
  ticker: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  date: Date | null;
}
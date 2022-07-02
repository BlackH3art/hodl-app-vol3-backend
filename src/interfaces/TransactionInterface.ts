export interface TransactionInterface {
  ticker: string;
  type: "buy" | "sell";
  quantity: number;
  entryPrice: number;
  openDate: Date;
  historyItemID: string;
}

export interface TransactionBodyInterface {
  ticker: string;
  type: "buy" | "sell";
  quantity: number;
  entryPrice: number;
}
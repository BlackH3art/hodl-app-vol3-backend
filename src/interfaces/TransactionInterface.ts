export interface TransactionInterface {
  ticker: string;
  type: "buy" | "sell";
  quantity: number;
  entryPrice: number;
  openData: Date;
  historyItemID: string;
}
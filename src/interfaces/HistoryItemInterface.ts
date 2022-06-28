export interface HistoryItemInterface {
  ticker: string;
  type: "buy" | "sell";
  sellingPrice: number;
  entryPrice: number;
  quanity: number;
  sellingQuantity: number; 
  invested: number;
  gain: number;
  closeDate: Date;
  openDate: Date;
}
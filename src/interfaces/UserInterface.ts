import { UserData } from "src/schemas/user.schema";
import { HistoryItemInterface } from "./HistoryItemInterface";
import { TransactionInterface } from "./TransactionInterface";

export interface UserInterface {
  data: UserData;
  invested: number;
  transactions: TransactionInterface[];
  history: HistoryItemInterface[];
  currentToken: string | null;
}
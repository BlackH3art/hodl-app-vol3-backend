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

export interface UserRegisterInterface {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserLoginInterface {
  email: string;
  password: string;
}
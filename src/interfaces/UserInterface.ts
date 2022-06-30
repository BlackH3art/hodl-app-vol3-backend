import { HistoryItem } from "src/schemas/historyItem.schema";
import { TransactionItem } from "src/schemas/transactionItem.schema";
import { UserData } from "src/schemas/user.schema";


export interface UserInterface {
  data: UserData;
  invested: number;
  transactions: TransactionItem[];
  history: HistoryItem[];
  currentToken: string | null;
  terms: boolean;
} 

export interface UserResponseInterface {
  email: string;
  invested: number;
  transactions: TransactionItem[];
  history: HistoryItem[];
  currentToken: string | null;
  terms: boolean;
} 

export interface UserRegisterInterface {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface UserLoginInterface {
  email: string;
  password: string;
}
export interface Transaction {
  from: string;
  to: string;
  amount: number;
  description: string;
}

export interface AdminTxn {
  accountnumber: string;
  admincode: string;
  amount: string;
  adminemail: string;
}

export type TxnReceipt = [
  string,
  string,
  string,
  string,
  "credit" | "debit",
  "NOW()",
  number,
  "successful" | "failed" | "pending"
];

export interface UserTxn {
  accountnumber: string;
  usercode: string;
  amount: string;
  useraccount: string;
}

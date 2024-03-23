export interface CurrentUser {
  email: string;
  account_number: string;
  status: boolean;
  balance: string;
  address: string;
  tel: string;
  firstname: string;
  lastname: string;
}
export type UserData =
  | { user: CurrentUser; success: true }
  | { success: false };

export interface NewUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  tel?: string;
  address?: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  status: boolean;
  tel: string;
  address: string;
  balance: number;
  created_at: Date;
  password: string;
}

export interface ResetPassword {
  email: string;
}

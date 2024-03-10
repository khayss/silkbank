export interface NewAdmin {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  admintoken: string;
}

export interface Admin {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  created_at: Date;
  password: string;
}
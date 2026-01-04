export type Role = 'ADMIN' | 'REFERENT';

export interface EstablishmentUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  isPending?: boolean;
}

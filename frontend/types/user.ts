export type Role = 'ADMIN' | 'TEACHER';

export interface EstablishmentUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  isPending?: boolean;
}

export interface UserInfo {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  establishment?: string;
  provider?: string;
  profilePic?: string;
  trialEndDate?: string;
  planType?: 'FREE' | 'PREMIUM';
  subscriptionStatus?: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' | 'INCOMPLETE';
  numberOfClasses?: number;
}

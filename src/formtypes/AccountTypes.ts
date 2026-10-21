export type ServiceRequest = {
  id: number;
  user_id: number;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  subject: string | null;
  request_description: string | null;
  is_viewed: number;
  is_completed: string;
  created_at: string | null;
  updated_at: string | null;
};

export type AccountUser = {
  id: number;
  name: string;
  email: string;
  address: string | null;
  phone_number: string | null;
  email_verified_at: string | null;
  user_type: number;
  requests: ServiceRequest[];
  created_at: string;
  updated_at: string;
};

export type AccountResponse = {
  success: boolean;
  user: AccountUser;
  message?: string;
};

export type UpdateAccountData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type SubmitRequestData = {
  user_id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  subject: string;
  description: string;
};

export type SubmitRequestResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  password_confirmation: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  [key: string]: unknown;
};

export type AuthResponse = {
  message?: string;
  authtoken?: string;
  access_token?: string;
  user?: AuthUser;
  authorisation?: {
    token?: string;
    type?: string;
  };
  data?: {
    token?: string;
    user?: AuthUser;
  };
};

export type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type ResetPasswordData = {
  token: string;
  new_password: string;
};

export type ChangePasswordData = {
  current_password: string;
  new_password: string;
};

export type MessageResponse = {
  message: string;
};

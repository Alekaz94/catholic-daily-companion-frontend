export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserPasswordChange {
  currentPassword: string;
  newPassword: string;
}

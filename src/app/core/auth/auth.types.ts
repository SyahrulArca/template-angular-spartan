export interface LoginCredentials {
  email: string;
  password: string;
}

/** Profil user dari `/auth/me` — sesuaikan dengan kontrak backend. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

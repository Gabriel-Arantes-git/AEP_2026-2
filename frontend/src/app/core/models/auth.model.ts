export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nome: string;
  perfil: string;
}

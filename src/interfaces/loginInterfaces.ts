export interface LoginResponse {
  readonly success: boolean;
  readonly message: string;
  readonly token: string;
}

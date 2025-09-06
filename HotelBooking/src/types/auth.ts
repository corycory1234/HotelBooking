// Authentication related type definitions

export interface SecureTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  login_type: 'traditional' | 'google_oauth';
  created_at: number;
}

export interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  needsRefresh: boolean;
  tokenData?: SecureTokenData;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  login_type: 'traditional' | 'google_oauth';
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Google OAuth related types
export interface GoogleOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token: string;
}

export interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

// Token refresh types
export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  expires_in: number;
}

// Session management types
export interface SessionInfo {
  isValid: boolean;
  expiresAt: number;
  userId: string;
  loginType: 'traditional' | 'google_oauth';
  timeUntilExpiry: number;
}

// API Error types
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Cookie configuration types
export interface CookieConfig {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

// Authentication context types
export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
}
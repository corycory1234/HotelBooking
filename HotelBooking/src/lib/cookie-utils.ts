export interface CookieConfig {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

export const DEFAULT_COOKIE_CONFIG: CookieConfig = {
  name: 'hotel_auth_token',
  httpOnly: false, // Client-side cookies cannot be httpOnly
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

export class CookieManager {
  private config: CookieConfig;

  constructor(config: CookieConfig = DEFAULT_COOKIE_CONFIG) {
    this.config = config;
  }

  /**
   * Set cookie on client-side
   */
  setCookie(value: string, customConfig?: Partial<CookieConfig>): void {
    if (typeof window === 'undefined') {
      console.warn('CookieManager.setCookie called on server-side, skipping');
      return;
    }

    const finalConfig = { ...this.config, ...customConfig };
    let cookieString = `${finalConfig.name}=${encodeURIComponent(value)}`;
    
    if (finalConfig.maxAge) {
      const expires = new Date(Date.now() + finalConfig.maxAge).toUTCString();
      cookieString += `; expires=${expires}`;
    }
    
    cookieString += `; path=${finalConfig.path}`;
    cookieString += `; sameSite=${finalConfig.sameSite}`;
    
    if (finalConfig.secure) {
      cookieString += '; secure';
    }

    document.cookie = cookieString;
  }

  /**
   * Get cookie value on client-side
   */
  getCookie(): string | undefined {
    if (typeof window === 'undefined') {
      console.warn('CookieManager.getCookie called on server-side, returning undefined');
      return undefined;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${this.config.name}=`);
    
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : undefined;
    }
    
    return undefined;
  }

  /**
   * Delete cookie on client-side
   */
  deleteCookie(): void {
    if (typeof window === 'undefined') {
      console.warn('CookieManager.deleteCookie called on server-side, skipping');
      return;
    }

    document.cookie = `${this.config.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${this.config.path};`;
  }

  /**
   * Check if cookie exists on client-side
   */
  hasCookie(): boolean {
    return !!this.getCookie();
  }
}

// Default instance
export const tokenCookieManager = new CookieManager(DEFAULT_COOKIE_CONFIG);
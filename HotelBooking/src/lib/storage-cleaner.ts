/**
 * Clean sensitive token data from localStorage
 */
export const cleanSensitiveStorageData = (): void => {
  if (typeof window === 'undefined') {
    return; // Server-side, skip
  }

  try {
    // Get the persisted Redux data
    const persistedData = localStorage.getItem('persist:root');
    if (persistedData) {
      const parsedData = JSON.parse(persistedData);
      
      // Clean access_Token if it exists
      if (parsedData.access_Token) {
        const accessTokenData = JSON.parse(parsedData.access_Token);
        
        // Clear sensitive token fields
        if (accessTokenData.data && accessTokenData.data.tokens) {
          accessTokenData.data.tokens.access_token = '';
          accessTokenData.data.tokens.refresh_token = '';
          
          // Update the cleaned data back to localStorage
          parsedData.access_Token = JSON.stringify(accessTokenData);
          localStorage.setItem('persist:root', JSON.stringify(parsedData));
          
          console.log('Cleaned sensitive token data from localStorage');
        }
      }
    }
    
    // Clean Supabase auth tokens from localStorage
    const supabaseAuthKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') && key.endsWith('-auth-token')
    );
    
    supabaseAuthKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Cleaned Supabase token: ${key}`);
    });
    
    // Also clean any other potential token storage
    const keysToClean = [
      'hotel_auth_token', // Our cookie name if it leaked to localStorage
      'supabase.auth.token',
      'auth_token',
      'access_token',
      'refresh_token'
    ];
    
    keysToClean.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Cleaned ${key} from localStorage`);
      }
    });
    
  } catch (error) {
    console.error('Failed to clean localStorage:', error);
  }
};

/**
 * Force clean all authentication related data (for emergency cleanup)
 */
export const forceCleanAuthStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Clear the entire persisted state and let it rebuild without tokens
    localStorage.removeItem('persist:root');
    
    // Clear other potential auth storage
    const authKeys = [
      'hotel_auth_token',
      'supabase.auth.token', 
      'auth_token',
      'access_token',
      'refresh_token',
      'user_session',
      'auth_state'
    ];
    
    authKeys.forEach(key => localStorage.removeItem(key));
    
    console.log('Force cleaned all auth storage');
  } catch (error) {
    console.error('Failed to force clean storage:', error);
  }
};
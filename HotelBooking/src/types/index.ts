// Type definitions index file - centralized exports

// Legacy types (keep for backward compatibility)
export * from './access_Token';
export * from './add_Hotel_Detail';
export * from './booking_Detail';
// Re-export create_Hotel types with explicit naming to avoid conflicts
export type { 
  Hotel_List_Type as CreateHotelListType,
  create_Hotel_Interface as CreateHotelInterface
} from './create_Hotel';
export * from './debouncedHotel';
export * from './form_Search';
export * from './hotel_Detail';
export * from './my_Collection_List';
export * from './offer';
export * from './traveler_Info';
export * from './user_Info';
export * from './zod_Error_Response';

// New authentication types (for token-cookie migration)
export * from './auth';

// Re-export commonly used types with aliases for migration compatibility
export type {
  SecureTokenData as NewTokenData,
  AuthUser as NewUserData,
  AuthResponse as NewAuthResponse,
  TokenValidationResult,
  SessionInfo,
  AuthContextValue
} from './auth';
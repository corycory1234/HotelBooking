export interface Access_Token_Interface {
  success: boolean,
  data: {
    user: {
      id: string
      name: string,
      userType: string,
      email: string
    },
    tokens: {
      access_token: string,
      refresh_token: string
    }
  }
};
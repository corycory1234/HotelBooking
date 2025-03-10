export interface User_Data_Interface {
  id: string,
  name: string,
  userType: string,
  email: string
};

export interface User_Info_Interface {
  success: boolean,
  data: User_Data_Interface
}
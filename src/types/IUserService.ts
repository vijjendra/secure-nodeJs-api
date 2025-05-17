export interface IUserLoginResponse {
  Id: string;
  userId: string;
  emailAddress: string;
  name: string
  mobile: string | null
}

export interface IUserTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: IUserLoginResponse;
}

export interface IUserService {
  userSignup(userData: any, res: any): Promise<any>;
  userLogin(emailAddress: string, password: string, res: any): Promise<any>;
  getUserDetail(userId: string): Promise<any>;
  regenerateAccessToken(userId: string, res: any): Promise<any>;
  changePassword(data: any): Promise<any>;
  updatePasswords(): Promise<any>;
} 
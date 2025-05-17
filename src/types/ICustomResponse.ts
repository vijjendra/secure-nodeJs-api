export interface ICustomResponse {
  isSuccess: boolean;
  data: any;
  message: string;
  errors?: any;
}
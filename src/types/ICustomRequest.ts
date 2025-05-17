import { Request } from "express";

export interface ICustomRequest extends Request {
  user?: {
    userId: string;
    emailAddress: string;
    name: string;
    mobile: string;
  };
}
import  { Document } from "mongoose";
import { UserStatus } from "../utils/status.enum";

export interface IUserMaster extends Document {
  userId: string;
  emailAddress: string;
  password: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  status: UserStatus;
  createdAt?: Date; // Added automatically by timestamps
  updatedAt?: Date; // Added automatically by timestamps
}

export interface IUserSignupRequest {
  emailAddress: string;
  password: string;
  firstName?: string | "User";
  lastName?: string | null;
  mobile?: string | null;
}

export interface IChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

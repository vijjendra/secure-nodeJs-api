import mongoose, { Schema } from "mongoose";
import { IUserMaster } from "../types/IUserMaster";
import { UserStatus } from "../utils/status.enum";
import generalUtilities from "../utils/generalUtilities";

const userSchema = new Schema<IUserMaster>(
  {
    userId: {
      type: String,
      default: generalUtilities.generateShortSecureId(12, "usr"),
      unique: true,
      required: true,
    },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserMaster>("User", userSchema, "User");

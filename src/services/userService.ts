import UserMaster from "../models/UserMaster";
import { Response } from "express";
import { CustomError } from "../utils/customError";
import { IUserMaster, IUserSignupRequest, IChangePasswordRequest } from "../types/IUserMaster";
import { ICustomResponse } from "../types/ICustomResponse";
import generalUtilities from "../utils/generalUtilities";
import JWTTokenMiddleware from "../middlewares/JWTTokenMiddleware";
import bcrypt from "bcryptjs";
import { BaseService } from "./base/BaseService";
import { IUserService, IUserLoginResponse, IUserTokenResponse } from "../types/IUserService";
import { UserStatus } from "../utils/status.enum";

export class UserService extends BaseService implements IUserService {
  private readonly BATCH_SIZE = 1000;

 /**
  * Signup User 
  * @param userData - The user data to signup.
  * @param res - The response object to send the response to.
  * @returns {Promise<ICustomResponse>} A promise that resolves to the user details.
  */
  async userSignup(
    userData: IUserSignupRequest,
    res: Response
  ): Promise<ICustomResponse> {
    return this.executeWithErrorHandling(async () => {
      const existingUser = await UserMaster.findOne({ emailAddress: userData.emailAddress });
      if (existingUser) {
        return {
          isSuccess: false,
          data: null,
          message: "User already exists with this email address",
        };
      }
     
      const hashedPassword = await generalUtilities.encryptedPassword(userData.password);
      const newUser = await this.createUser(userData, hashedPassword);
      const loginUser = this.signupOrLoginUserData(newUser);
      const tokens = this.generateTokens(loginUser, res);

      return {
        isSuccess: true,
        data: { ...tokens, user: loginUser },
        message: "User saved successfully.",
      };
    }, "Failed to register user");
  }

  /**
   * Get User Detail for login
   * @param emailAddress - The email address of the user to get details for.
   * @param password - The password of the user to get details for.
   * @param res - The response object to send the response to.
   * @returns {Promise<ICustomResponse | null>} A promise that resolves to the user details or null if the user is not found.
   */
  async userLogin(
    emailAddress: string,
    password: string,
    res: Response // Receive the response object here
  ): Promise<ICustomResponse | null> {
    return this.executeWithErrorHandling(async () => {
      const userDetail = await UserMaster.findOne({
        emailAddress,
        status: UserStatus.ACTIVE,
      }).select("+password").lean();

      console.log("userDetail", userDetail);
      if (!userDetail) {
        return {
          isSuccess: false,
          data: null,
          message: "Login failed, Invalid email or password",
        };
      }

      const isMatch = await bcrypt.compare(password, userDetail.password);
      if (!isMatch) {
        return {
          isSuccess: false,
          data: null,
          message: "Login failed, Invalid email or password",
        };
      }

      const loginUser = this.signupOrLoginUserData(userDetail);
      const tokens = this.generateTokens(loginUser, res);

      return {
        isSuccess: true,
        data: { ...tokens, user: loginUser },
        message: "Login successful",
      };
    }, "Failed to login");
  }

  /* Get User Detail 
  * @param {string} userId - The user ID of the user to get details for.
  * @returns {Promise<IUserMaster>} A promise that resolves to the user details.
  */
  async getUserDetail(userId: string): Promise<IUserMaster> {
    return this.executeWithErrorHandling(async () => {
      const userDetail = await UserMaster.findOne({
        activeStatus: true,
        userId: userId,
      }).lean();
      
      if (!userDetail) {
        throw new CustomError("User not found", 404);
      }
      
      return userDetail as IUserMaster;
    }, "Failed to get user details");
  }

 

  /**
   * Regenerate Access Token using Refresh Token.
   * @param {string} userId - The refresh token provided by the user.
   * @returns {Promise<object>} The new access token and user details.
   */
  async regenerateAccessToken(userId: string, res: Response): Promise<object> {
    return this.executeWithErrorHandling(async () => {
      const userDetail = await UserMaster.findOne({
        userId,
        activeStatus: true,
      });

      if (!userDetail) {
        throw new CustomError("User not found", 404);
      }

      const loginUser = this.signupOrLoginUserData(userDetail);
      const accessToken = JWTTokenMiddleware.generateAccessToken(loginUser, res);

      return { accessToken };
    }, "Failed to regenerate access token");
  }

  /**
   * Change Password
   * @param {IChangePasswordRequest} data - The data to change the password.
   * @returns {Promise<ICustomResponse | null>} A promise that resolves to the user details or null if the user is not found.
   */
  async changePassword({
    userId,
    oldPassword,
    newPassword,
  }: IChangePasswordRequest): Promise<ICustomResponse | null> {
    return this.executeWithErrorHandling(async () => {
      const user = await UserMaster.findOne({ userId: userId }).select(
        "+password"
      );

      if (!user) {
        return {
          isSuccess: false,
          data: false,
          message: "User not found.",
        };
      }

      // Check if the old password matches
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return {
          isSuccess: false,
          data: false,
          message: "Old password is incorrect.",
        };
      }

      // Hash the new password
      const hashedPassword = await generalUtilities.encryptedPassword(
        newPassword
      );

      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
      return {
        isSuccess: true,
        data: true,
        message: "Password changed successfully.",
      };
    }, "Failed to change password");
  }

  /*
   * update all users' passwords to hashed format
   * @returns {Promise<ICustomResponse>} A promise that resolves to the user details.
   */
  async updatePasswords(): Promise<ICustomResponse> {
    return this.executeWithErrorHandling(async () => {
      const startTime = Date.now(); // Record the start time
      let totalUpdated = 0;

      while (true) {
        // Fetch a batch of users whose password is not hashed yet
        const users = await UserMaster.find({
          password: { $not: { $regex: /^\$2[ayb]\$/ } },
        })
          .limit(this.BATCH_SIZE)
          .lean(); // .lean() for better performance

        if (users.length === 0) break; // No more users to update

        const bulkOperations = users.map((user) => ({
          updateOne: {
            filter: { _id: user._id },
            update: {
              $set: {
                password: generalUtilities.encryptedPassword(user.password),
              },
            }, // Hash the password
          },
        }));

        // Bulk update operation
        await UserMaster.bulkWrite(bulkOperations);
        totalUpdated += users.length;
        console.log(`✅ Updated ${totalUpdated} users`);
      }

      const endTime = Date.now(); // Record the end time
      const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds

      console.log(`🎉 Password update completed successfully in ${elapsedTime} seconds!`);

      return {
        isSuccess: true,
        data: null,
        message: `Successfully updated ${totalUpdated} users' passwords in ${elapsedTime} seconds.`,
      };
    }, "Failed to update passwords");
  }


  private async createUser(userData: IUserSignupRequest, hashedPassword: string): Promise<IUserMaster> {
    return this.executeWithErrorHandling(async () => {
      const newUser = new UserMaster({
        emailAddress: userData.emailAddress,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobile: userData.mobile
      });
      return await newUser.save();
    }, "Failed to create user");
  }

  private signupOrLoginUserData(user: any): IUserLoginResponse {
    
      const fullName = generalUtilities.formatFullName(
        user.firstName,
        user.lastName
      );

    return {
      Id: user._id,
      userId: user.userId,
      emailAddress: user.emailAddress,
      name: fullName,
      mobile: user.mobile
    };
  }

  private generateTokens(loginUser: IUserLoginResponse, res: Response): IUserTokenResponse {
    return {
      accessToken: JWTTokenMiddleware.generateAccessToken(loginUser, res),
      refreshToken: JWTTokenMiddleware.generateRefreshToken(loginUser, res),
      user: loginUser,
    };
  }

}

export default new UserService();

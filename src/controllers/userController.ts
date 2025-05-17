import {  Response, NextFunction } from "express";
import userService from "../services/userService";
import { BaseController } from "./base/BaseController"
import { ICustomRequest } from "../types/ICustomRequest";
import {
  changePasswordSchema,
} from "../validations/schemas";
import {
  IChangePasswordRequest,
} from "../types/IUserMaster";
import { validateRequest } from "../middlewares/validationMiddleware";


class UserController extends BaseController {
  protected service = userService;

  // Handle change password request
  changePassword = async (
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      try {
        validateRequest(changePasswordSchema)(req, res, () => {});
      } catch (validationError: any) {
        console.error("Change password validation error:", {
          message: validationError.message,
          details: validationError.details,
          body: req.body,
        });
        throw new Error("Invalid password change data");
      }

      const passwordData: IChangePasswordRequest = req.body;
      return await userService.changePassword(passwordData);
    });
  };

  // get current user detail
  getCurrentUser = async (
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      // const userId = this.getUserId(req);
      const currentUser = req.user;
      if (!currentUser) {
        throw new Error("User not found");
      }
      return currentUser;
    });
  };

  // #endregion

  // Handles user Verify OTP and Login
  regenerateAccessToken = async (
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const userId = this.getUserId(req);
      return await this.service.regenerateAccessToken(userId, res);
    });
  };
}

const userController = new UserController();
export default userController;

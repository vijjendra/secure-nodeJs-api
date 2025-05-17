// File: src/controllers/authController.ts
import {  Response, NextFunction } from 'express';
import { BaseController } from './base/BaseController';
import { userSignupSchema, userLoginSchema } from '../validations/schemas';
import { validateRequest } from '../middlewares/validationMiddleware';
import userService from '../services/userService';
import { IUserSignupRequest } from '../types/IUserMaster';
import { ICustomRequest } from '../types/ICustomRequest';


class AuthController extends BaseController {
  protected service = userService;

  signup = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      try {
        validateRequest(userSignupSchema)(req, res, () => {});
      } catch (validationError: any) {
        console.error('Registration validation error:', {
          message: validationError.message,
          details: validationError.details,
          body: req.body
        });
        throw new Error('Invalid registration data');
      }

      const userData: IUserSignupRequest = req.body;
      return await userService.userSignup(userData, res);
    });
  }

  login = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {

    await this.handleRequest(req, res, next, async () => {
      try {
        validateRequest(userLoginSchema)(req, res, () => {});
      } catch (validationError: any) {
        console.error('Login validation error:', {
          message: validationError.message,
          details: validationError.details,
          body: req.body
        });
        throw new Error('Invalid login data');
      }

      const { emailAddress, password } = req.body;
      const result = await userService.userLogin(emailAddress, password, res);
      return result;
    });
  }

  
}

const authController = new AuthController();
export default authController;

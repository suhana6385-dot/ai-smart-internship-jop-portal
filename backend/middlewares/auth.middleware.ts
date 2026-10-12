import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../config/jwt";
import ApiError from "../utils/ApiError";
import User from "../models/User";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(401, "Not authorized, no token provided");
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new ApiError(401, "User not found or inactive");
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Not authorized, token invalid or expired"));
  }
};

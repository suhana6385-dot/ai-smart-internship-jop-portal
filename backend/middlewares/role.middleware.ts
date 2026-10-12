import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, "Not authorized"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role '${req.user.role}' is not allowed to access this resource`));
    }
    next();
  };
};

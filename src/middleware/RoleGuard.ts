import { NextFunction, Response } from "express";
import ForbiddenError from "../errors/errorTypes/ForbiddenError";
import { ERole } from "../domains/roles/dto";
import CustomRequest from "../types/CustomRequest";

export default function RoleGuard(requiredRoles: ERole[]) {
  return async function (req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      if (!user) {
        throw new ForbiddenError();
      }
      if (requiredRoles.includes(user.role.name)) {
        next();
      } else {
        throw new ForbiddenError();
      }
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  };
}

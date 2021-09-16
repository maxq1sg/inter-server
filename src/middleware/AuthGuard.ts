import { NextFunction, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../errors/HttpStatusCodes";
import { TokenPayload } from "../domains/auth/dtos/aut.dto";
import CustomError from "../errors/errorTypes/CustomError";
import CustomRequest from "../types/CustomRequest";

const AuthGuard = asyncHandler(
  (req: CustomRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      throw new CustomError(HttpStatusCode.UNAUTHORIZED, "Войдите в систему!");
    }
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      throw new CustomError(HttpStatusCode.UNAUTHORIZED, "Войдите в систему!");
    }

    try {
      const decodedUser = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as TokenPayload;
      req.user = decodedUser;
      next();
    } catch (error) {
      throw new CustomError(HttpStatusCode.UNAUTHORIZED, "Войдите в систему!");
    }
  },
);
export default AuthGuard;

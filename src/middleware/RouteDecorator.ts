import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import CustomError from "../errors/errorTypes/CustomError";
import { HttpStatusCode } from "../errors/HttpStatusCodes";
import CustomRequest from "../types/CustomRequest";
import { metaType, RequestPayload } from "./types/MetaType";

//todo
const Route =
  (metaTypes: metaType[]) =>
  (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalRouteHandler = descriptor.value;
    descriptor.value = async function (
      req: CustomRequest,
      res: Response,
      next: NextFunction
    ) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new CustomError(
            HttpStatusCode.BAD_REQUEST,
            "Validation Error",
            errors.array()
          );
        }

        const payload: RequestPayload = metaTypes.reduce(
          (prev: RequestPayload, meta: metaType) => {
            prev[meta] = req[meta];
            return prev;
          },
          {}
        );
        const fnReturn = await originalRouteHandler.call(this, payload);
        res.status(200).json(fnReturn);
      } catch (err) {
        next(err);
      }
    };

    return {
      configurable: true,
      get(this: Function) {
        const bound = descriptor.value!.bind(this);
        Object.defineProperty(this, propertyKey, {
          value: bound,
          configurable: true,
          writable: true,
        });
        return bound;
      },
    };
  };

export default Route;

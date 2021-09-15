import { Router } from "express";
import { checkSchema } from "express-validator";
import { loginSchema, registrationSchema } from "./validation";

export default  function initAuthRouter(router:Router){
  router.post(
    "/register",
    checkSchema(registrationSchema),
    this.registerUser
  );
  router.post("/login", checkSchema(loginSchema), this.loginUser);
}
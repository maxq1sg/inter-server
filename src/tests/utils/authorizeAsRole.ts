import supertest from "supertest";
import { ERole } from "../../domains/roles/dto/index";
import { AuthResponseBody } from "../../domains/auth/dtos/aut.dto";

export default async function authorizeAsRole(
  request: supertest.SuperTest<supertest.Test>,
  role: ERole,
): Promise<AuthResponseBody> {
  const loginResponse = await request
    .post("/api/auth/login")
    .send({ email: `${role.toLowerCase()}@gmail.com`, password: "12345" });
  return loginResponse.body;
}

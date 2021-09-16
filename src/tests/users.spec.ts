// import supertest from "supertest";

// import { Connection } from "typeorm";
// import { Application } from "express";
// import UserService from "../domains/users/user.service";
// import EventService from "../domains/events/event.service";
// import authorizeAsRole from "./utils/authorizeAsRole";
// import { ERole } from "../domains/roles/dto";
// import setupDB, { EMode } from "../setupDb";
// import App from "../app";

// describe("test users route", () => {
//   let request: supertest.SuperTest<supertest.Test>;
//   let connection: Connection;
//   let user_ids: number[];
//   let event_ids: number[];
//   let server: Application;

//   beforeAll(async () => {
//     connection = await setupDB(EMode.TEST);
//     server = new App().app;
//     request = supertest(server);
//     user_ids = await UserService.seedUsers();
//     event_ids = await EventService.seedEvents(user_ids);
//   });

//   test("Users without permission \"SHOW_USERS_LIST\" can\'t show users list", async () => {
//     const { token } = await authorizeAsRole(request, ERole.USER);
//     const response = await request
//       .get("/api/users")
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.statusCode).toBe(403);
//   });

//   test("Users with permission \"SHOW_USERS_LIST\" can show users list", async () => {
//     const { token } = await authorizeAsRole(request, ERole.ADMIN);
//     const response = await request
//       .get("/api/users")
//       .set("Authorization", `Bearer ${token}`);
//     expect(response.statusCode).toBe(200);
//   });

//   test("authorized users can see their event subscriptions", async () => {
//     const { token } = await authorizeAsRole(request, ERole.ADMIN);
//     await request
//       .post("/api/sub/add")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         userId: user_ids[0],
//         eventId: event_ids[0],
//       });

//     const response = await request
//       .get(`/api/users/${user_ids[0]}/events`)
//       .set("Authorization", `Bearer ${token}`)
//       .send({ id: user_ids[0] });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.length).toBe(1);
//   });

//   test("users can't see event subscriptions of other users", async () => {
//     const { token } = await authorizeAsRole(request, ERole.EDITOR);

//     const response = await request
//       .get(`/api/users/${user_ids[0]}/events`)
//       .set("Authorization", `Bearer ${token}`)
//       .send({ id: user_ids[0] });
//     expect(response.statusCode).toBe(403);
//   });

//   test("admin users can change users role", async () => {
//     const { token } = await authorizeAsRole(request, ERole.ADMIN);

//     const response = await request
//       .put("/api/users/role")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ user_id: user_ids[1], role_id: 2 });

//     expect(response.statusCode).toBe(200);

//     const getUserResponse = await request
//       .get(`/api/users/${user_ids[1]}`)
//       .set("Authorization", `Bearer ${token}`);
//     expect(getUserResponse.body.role.name).toBe("USER");
//   });

//   afterAll(async () => {
//     await EventService.clearEvents();
//     await UserService.clearUsers();
//     await connection.close();
//   });
// });

import supertest from "supertest";
import { Connection } from "typeorm";
import UserService from "../domains/users/user.service";
import EventService from "../domains/events/event.service";
import authorizeAsRole from "./utils/authorizeAsRole";
import { ERole } from "../domains/roles/dto";
import { Application } from "express";
import setupDB, { EMode } from "../setupDb";
import App from "../app";

describe("test event route", function () {
  let request: supertest.SuperTest<supertest.Test>;
  let connection: Connection;
  let user_ids: number[];
  let event_ids: number[];
  let server: Application;

  beforeAll(async () => {
    connection = await setupDB(EMode.TEST);
    server = new App().app;
    request = supertest(server);
    user_ids = await UserService.seedUsers();
    event_ids = await EventService.seedEvents(user_ids);
  });
  test("unathorized user can't create events", async () => {
    const response = await request.post("/api/events").send({
      owner_id: user_ids[0],
      body: { name: "mainEvent", description: "very interesting" },
    });
    expect(response.statusCode).toBe(401);
  });

  test("users with \"CREATE_EVENT\" permission can create events", async () => {
    const { token } = await authorizeAsRole(request, ERole.ADMIN);
    const response = await request
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        owner_id: user_ids[2],
        body: { name: "mainEvent", description: "very interesting" },
      });
      console.log(response.body)
    expect(response.statusCode).toBe(200);
  });

  test("users with no \"CREATE_EVENT\" permission can\'t create events", async () => {
    const { token } = await authorizeAsRole(request, ERole.USER);
    const response = await request
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        owner_id: user_ids[2],
        body: { name: "mainEvent", description: "very interesting" },
      });
    expect(response.statusCode).toBe(403);
  });

  test("every user can search for events", async () => {
    const response = await request.post("/api/events/search").send({
      query: "fourth",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("authorized users can modify only own events", async () => {
    const { token } = await authorizeAsRole(request, ERole.EDITOR);

    const changeOwnEvent = await request
      .put("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: event_ids[1],
        body: { name: "changedName" },
      });

    expect(changeOwnEvent.statusCode).toBe(200);

    const changeOtherEvent = await request
      .put("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: event_ids[0],
        body: { name: "changedName" },
      });

    expect(changeOtherEvent.statusCode).toBe(403);
  });

  afterAll(async () => {
    await EventService.clearEvents();
    await UserService.clearUsers();
    await connection.close();
  });
});

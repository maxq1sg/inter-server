import supertest from "supertest";
import { Connection } from "typeorm";
import { Application } from "express";
import UserService from "../domains/users/user.service";
import EventService from "../domains/events/event.service";
import setupDB, { EMode } from "../setupDb";
import App from "../app";

describe("test auth route", () => {
  let request: supertest.SuperTest<supertest.Test>;
  let connection: Connection;
  let user_ids: number[];
  // let event_ids: number[];
  let server: Application;

  beforeAll(async () => {
    connection = await setupDB(EMode.TEST);
    server = new App().app;
    request = supertest(server);
    user_ids = await UserService.seedUsers();
    await EventService.seedEvents(user_ids);
  });

  test("user can login only with correct data", async () => {
    const responseWithCorrectData = await request
      .post("/api/auth/login")
      .send({ email: "admin@gmail.com", password: "12345" });
    expect(responseWithCorrectData.statusCode).toBe(200);
  });

  test("user can't login with incorrect data", async () => {
    const responseWithIncorrectData = await request
      .post("/api/auth/login")
      .send({ email: "admin@gmail.com", password: "123456" });
    expect(responseWithIncorrectData.statusCode).toBe(401);
  });

  test("user can register with correct data", async () => {
    const response = await request.post("/api/auth/register").send({
      first_name: "ivan",
      last_name: "ivanov",
      password: "12345",
      email: "max@gmail.com",
      role: "EDITOR",
    });
    expect(response.statusCode).toBe(200);
  });

  test("user can't register when fields validation fails", async () => {
    const response = await request.post("/api/auth/register").send({
      last_name: "ivanov",
      password: "1235",
      email: "admingmail.com",
      role: "EDITOR",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body?.body?.length).toBe(3);
  });

  test("user can't register with email already in use", async () => {
    const response = await request.post("/api/auth/register").send({
      first_name: "ivan",
      last_name: "ivanov",
      password: "12345",
      email: "admin@gmail.com",
      role: "EDITOR",
    });
    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    await EventService.clearEvents();
    await UserService.clearUsers();
    await connection.close();
  });
});

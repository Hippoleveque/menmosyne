import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import User from "../models/user.js";
import app from "../server.js";
import bcrypt from "bcryptjs";

describe("Test the authentication endpoints of the API.", () => {
  it("Tests POST /signup", async () => {
    const userBody = { email: "test@test.com", password: "tests" };
    sinon.mock(User).expects("createUser").resolves(userBody);
    sinon.mock(User).expects("getUser");
    const response = await request(app)
      .post("/auth/signup")
      .send(userBody)
      .set("Accept", "application/json")
      .expect(201);

    expect(response.body).to.have.property("message", "User has been created");
    expect(response.body).to.have.deep.property("user", userBody);
  });

  it("Tests POST /login", async () => {
    process.env.JWT_SECRET = "test";
    const mockUser = { _id: "id", email: "test@test.com", password: "tests" };
    sinon.mock(User).expects("getUser").resolves(mockUser);
    sinon.mock(bcrypt).expects("compare").resolves(true);
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "tests" })
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body).to.have.property("token");
    expect(response.body).to.have.property("userId", "id");
    expect(response.body).to.have.property("expirationDate");
  });

  afterEach(() => {
    sinon.restore();
  });
});

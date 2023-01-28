import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import User from "../models/user.js";
import app from "../server.js";

describe("Test the authentication endpoints of the API.", () => {
  it("POST /signup", async () => {
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

  after(() => {
    sinon.restore();
  });
});

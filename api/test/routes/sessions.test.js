import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import app from "../../server.js";
import DailySession from "../../models/dailySession.js";
import CardCollection from "../../models/cardCollection.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const Query = mongoose.Query;
const ObjectId = mongoose.Types.ObjectId;

describe("Test the sessions endpoints of the API.", () => {
  it("Tests POST /sessions", async () => {
    const collectionId = new ObjectId().toString();
    process.env.JWT_SECRET = "test";
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon
      .mock(DailySession.prototype)
      .expects("save")
      .resolves({ message: "ok" });
    sinon
      .mock(Query.prototype)
      .expects("exec")
      .resolves({
        _id: collectionId,
        save: () => {
          return { message: "ok" };
        },
      });
    const body = {
      cardCollectionId: collectionId,
    };
    const response = await request(app)
      .post("/sessions")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send(body)
      .expect(201);
    expect(response.body).to.have.property("dailySession");
  });

  afterEach(() => {
    sinon.restore();
  });
});

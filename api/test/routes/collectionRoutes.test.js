import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import app from "../../server.js";
import CardCollection from "../../models/cardCollection.js";
import jwt from "jsonwebtoken";

describe("Test the collections endpoints of the API.", () => {
  it("Tests GET /collections/:collectionId", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCollection = { _id: "id", title: "test", numCards: 6 };
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    const response = await request(app)
      .get("/memo/collections/id")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property("collection", mockedCollection);
  });

  it("Tests DELETE /collections/:collectionId", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCollection = { _id: "id", title: "test", numCards: 6 };
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    const response = await request(app)
      .get("/memo/collections/id")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property("collection", mockedCollection);
  });

  afterEach(() => {
    sinon.restore();
  });
});

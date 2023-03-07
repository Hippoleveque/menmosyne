import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import app from "../../server.js";
import CardCollection from "../../models/cardCollection.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const Query = mongoose.Query;
const ObjectId = mongoose.Types.ObjectId;

describe("Test the collections endpoints of the API.", () => {
  it("Tests GET /cardCollections", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCollections = [
      { _id: new ObjectId().toString(), name: "collection1" },
    ];
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon.mock(CardCollection).expects("countDocs").resolves(10);
    sinon
      .mock(CardCollection)
      .expects("getCollections")
      .resolves(mockedCollections);
    const response = await request(app)
      .get("/memo/cardCollections")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property(
      "cardCollections",
      mockedCollections
    );
    expect(response.body).to.have.property("totalCollections", 10);
  });

  it("Tests GET /cardCollections with page param", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCollections = [
      { _id: new ObjectId().toString(), name: "collection1" },
    ];
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon.mock(CardCollection).expects("countDocs").resolves(10);
    sinon
      .mock(CardCollection)
      .expects("getCollections")
      .resolves(mockedCollections);
    const response = await request(app)
      .get("/memo/cardCollections?offset=2&limit=5")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property(
      "cardCollections",
      mockedCollections
    );
    expect(response.body).to.have.property("totalCollections", 10);
  });

  it("Tests GET /cardCollections/:collectionId", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCollection = { _id: "id", title: "test", numCards: 6 };
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    const response = await request(app)
      .get("/memo/cardCollections/id")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property("cardCollection", mockedCollection);
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

  it("Tests POST /cardCollections", async () => {
    process.env.JWT_SECRET = "test";
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon
      .mock(CardCollection.prototype)
      .expects("save")
      .resolves({ message: "ok" });
    const body = {
      name: "exampleName",
      description: "exampleDescription",
    };
    const response = await request(app)
      .post("/memo/cardCollections")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send(body)
      .expect(201);
    expect(response.body).to.have.property("cardCollection");
  });

  afterEach(() => {
    sinon.restore();
  });
});

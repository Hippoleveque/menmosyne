import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import User from "../../models/user.js";
import app from "../../server.js";
import Card from "../../models/card.js";
import CardCollection from "../../models/cardCollection.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

describe("Test the cards endpoints of the API.", () => {
  it("Tests GET /cards/:collectionId", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCards = [
      { _id: new ObjectId().toString(), recto: "front", verso: "back" },
      { _id: new ObjectId().toString(), recto: "front", verso: "back" },
    ];
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon.mock(Card).expects("countDocs").resolves(10);
    sinon.mock(Card).expects("getCards").resolves(mockedCards);
    const response = await request(app)
      .get("/memo/cards/" + new ObjectId().toString())
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property("cards", mockedCards);
    expect(response.body).to.have.property("totalCards", 10);
  });

  it("Tests GET /cards/:collectionId with params", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCards = [
      { _id: new ObjectId().toString(), recto: "front", verso: "back" },
      { _id: new ObjectId().toString(), recto: "front", verso: "back" },
    ];
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon.mock(Card).expects("countDocs").resolves(10);
    sinon.mock(Card).expects("getCards").resolves(mockedCards);
    const response = await request(app)
      .get(`/memo/cards/${new ObjectId().toString()}?offset=2&limit=5`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property("cards", mockedCards);
    expect(response.body).to.have.property("totalCards", 10);
  });

  it("Tests GET /cardCollections", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCollections = [{ _id: new ObjectId().toString(), name: "collection1" }];
    sinon.mock(jwt).expects("verify").returns({ userId: new ObjectId().toString() });
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
    const mockedCollections = [{ _id: new ObjectId().toString(), name: "collection1" }];
    sinon.mock(jwt).expects("verify").returns({ userId: new ObjectId().toString() });
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

  afterEach(() => {
    sinon.restore();
  });
});

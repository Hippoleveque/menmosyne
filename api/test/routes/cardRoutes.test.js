import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import User from "../../models/user.js";
import app from "../../server.js";
import Card from "../../models/card.js";
import CardCollection from "../../models/cardCollection.js";
import jwt from "jsonwebtoken";

describe("Test the cards endpoints of the API.", () => {
  it("Tests GET /cards/:collectionId", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCards = [
      { _id: "id1", recto: "front", verso: "back" },
      { _id: "id2", recto: "front", verso: "back" },
    ];
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon.mock(Card).expects("count").resolves(10);
    sinon.mock(Card).expects("getCardsFromPage").resolves(mockedCards);
    const response = await request(app)
      .get("/memo/cards/1")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property("cards", mockedCards);
    expect(response.body).to.have.property("totalCards", 10);
  });

  it("Tests GET /cards/:collectionId with page params", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCards = [
      { _id: "id1", recto: "front", verso: "back" },
      { _id: "id2", recto: "front", verso: "back" },
    ];
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon.mock(Card).expects("count").resolves(10);
    sinon.mock(Card).expects("getCardsFromPage").resolves(mockedCards);
    const response = await request(app)
      .get("/memo/cards/1?page=2")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property("cards", mockedCards);
    expect(response.body).to.have.property("totalCards", 10);
  });

  it("Tests GET /cardCollections", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCollections = [{ _id: "id1", name: "collection1" }];
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon.mock(CardCollection).expects("count").resolves(10);
    sinon
      .mock(CardCollection)
      .expects("getCollectionsFromPage")
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
    const mockedCollections = [{ _id: "id1", name: "collection1" }];
    sinon.mock(jwt).expects("verify").returns({ userId: "id" });
    sinon.mock(CardCollection).expects("count").resolves(10);
    sinon
      .mock(CardCollection)
      .expects("getCollectionsFromPage")
      .resolves(mockedCollections);
    const response = await request(app)
      .get("/memo/cardCollections?page=2")
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

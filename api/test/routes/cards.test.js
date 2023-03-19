import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import app from "../../server.js";
import Card from "../../models/card.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const Query = mongoose.Query;
const ObjectId = mongoose.Types.ObjectId;

describe("Test the cards endpoints of the API.", () => {
  it("Tests POST /cards", async () => {
    process.env.JWT_SECRET = "test";
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    const collectionId = new ObjectId().toString();
    sinon
      .mock(Query.prototype)
      .expects("exec")
      .resolves({
        _id: collectionId,
        save: () => {
          return { message: "ok" };
        },
      });
    sinon.mock(Card.prototype).expects("save").resolves({ message: "ok" });
    const body = {
      rectoContent: "exampleRecto",
      versoContent: "exampleVerso",
      collectionId: collectionId,
    };
    const response = await request(app)
      .post("/cards")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send(body)
      .expect(201);
    expect(response.body).to.have.property("card");
  });

  it("Tests DELETE /cards/:cardId", async () => {
    process.env.JWT_SECRET = "test";
    const cardId = new ObjectId().toString();
    const userId = new ObjectId().toString();
    const mockedCollection = {
      _id: new ObjectId().toString(),
      owner: { _id: userId },
    };
    const mockedCard = {
      _id: cardId,
      rectoContent: "testRecto",
      versoContent: "testVerso",
      cardCollection: mockedCollection,
    };
    sinon.mock(jwt).expects("verify").returns({ userId: userId });
    sinon.mock(Card).expects("getCard").resolves(mockedCard);
    sinon.mock(Card).expects("deleteCard").resolves(mockedCard);
    await request(app)
      .delete("/cards/" + cardId)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
  });

  it("Tests POST /cards/:cardId/review", async () => {
    process.env.JWT_SECRET = "test";
    const cardId = new ObjectId().toString();
    const userId = new ObjectId().toString();
    const mockedCollection = {
      _id: new ObjectId().toString(),
      owner: { _id: userId },
    };
    const mockedCard = {
      _id: cardId,
      rectoContent: "testRecto",
      versoContent: "testVerso",
      cardCollection: mockedCollection,
      save: () => Promise.resolve({}),
    };
    sinon.mock(jwt).expects("verify").returns({ userId: userId });
    sinon.mock(Card).expects("getCard").resolves(mockedCard);
    await request(app)
      .post(`/cards/${cardId}/review`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
  });

  afterEach(() => {
    sinon.restore();
  });
});

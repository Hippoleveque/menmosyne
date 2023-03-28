import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import request from "supertest";
import app from "../../server.js";
import Card from "../../models/card.js";
import CardCollection from "../../models/cardCollection.js";
import CardReview from "../../models/cardReview.js";
import DailySession from "../../models/dailySession.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

chai.use(sinonChai);

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

  it("Tests POST /cards/:cardId/review creates new dailySession if need be", async () => {
    process.env.JWT_SECRET = "test";
    const cardId = new ObjectId().toString();
    const userId = new ObjectId().toString();
    const mockedCollectionSave = sinon.spy();
    const mockedCollection = {
      _id: new ObjectId().toString(),
      owner: { _id: userId },
      save: mockedCollectionSave,
    };
    const mockedCardSave = sinon.spy();
    const mockedDailySessionSave = sinon.spy();
    const mockedCard = {
      _id: cardId,
      rectoContent: "testRecto",
      versoContent: "testVerso",
      cardCollection: mockedCollection,
      save: mockedCardSave,
      easinessFactor: 2.5,
      numberReviewed: 0,
    };
    sinon.mock(jwt).expects("verify").returns({ userId: userId });
    sinon.mock(Card).expects("getCard").resolves(mockedCard);
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    sinon
      .mock(DailySession)
      .expects("find")
      .returns({
        sort: () => {
          return {
            limit: () => {
              return [];
            },
          };
        },
      });
    sinon
      .stub(DailySession.prototype, "save")
      .callsFake(mockedDailySessionSave);
    await request(app)
      .post(`/cards/${cardId}/review`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send({ ansQuality: 1 })
      .expect(200);
    expect(mockedCollectionSave).to.have.been.calledOnce;
    expect(mockedDailySessionSave).to.have.been.calledOnce;
  });

  it("Tests POST /cards/:cardId/review without saving review", async () => {
    process.env.JWT_SECRET = "test";
    const cardId = new ObjectId().toString();
    const userId = new ObjectId().toString();
    const mockedCollection = {
      _id: new ObjectId().toString(),
      owner: { _id: userId },
    };
    const mockedCardSave = sinon.spy();
    const mockedCard = {
      _id: cardId,
      rectoContent: "testRecto",
      versoContent: "testVerso",
      cardCollection: mockedCollection,
      save: mockedCardSave,
      easinessFactor: 2.5,
      numberReviewed: 0,
    };
    const mockedSession = {
      _id: new ObjectId().toString(),
    };
    sinon.mock(jwt).expects("verify").returns({ userId: userId });
    sinon.mock(Card).expects("getCard").resolves(mockedCard);
    sinon
      .mock(DailySession)
      .expects("find")
      .returns({
        sort: () => {
          return {
            limit: () => {
              return [mockedSession];
            },
          };
        },
      });
    await request(app)
      .post(`/cards/${cardId}/review`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send({ ansQuality: 1 })
      .expect(200);
    expect(mockedCardSave).to.have.been.called;
    expect(mockedCard.easinessFactor).equal(1.96);
    expect(mockedCard).to.not.have.property("lastReviewed");
    expect(mockedCard.numberReviewed).equal(0);
  });

  it("Tests POST /cards/:cardId/review with saving review", async () => {
    process.env.JWT_SECRET = "test";
    const cardId = new ObjectId().toString();
    const userId = new ObjectId().toString();
    const mockedCollection = {
      _id: new ObjectId().toString(),
      owner: { _id: userId },
    };
    const mockedCardSave = sinon.spy();
    const mockedCard = {
      _id: cardId,
      rectoContent: "testRecto",
      versoContent: "testVerso",
      cardCollection: mockedCollection,
      save: mockedCardSave,
      easinessFactor: 2.5,
      numberReviewed: 0,
    };
    const mockedSessionSave = sinon.spy();
    const mockedSession = {
      _id: new ObjectId().toString(),
      numReviews: {
        newCards: 0,
        reviewCards: 0,
      },
      save: mockedSessionSave,
    };
    sinon.mock(jwt).expects("verify").returns({ userId: userId });
    sinon.mock(Card).expects("getCard").resolves(mockedCard);
    sinon
      .mock(DailySession)
      .expects("find")
      .returns({
        sort: () => {
          return {
            limit: () => {
              return [mockedSession];
            },
          };
        },
      });
    const mockedCardReviewSave = sinon.spy();
    sinon.stub(CardReview.prototype, "save").callsFake(mockedCardReviewSave);

    await request(app)
      .post(`/cards/${cardId}/review`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send({ ansQuality: 5 })
      .expect(200);
    expect(mockedCardSave).to.have.been.called;
    expect(mockedCard.easinessFactor).equal(2.6);
    expect(mockedCard).to.have.property("lastReviewed");
    expect(mockedCard.numberReviewed).equal(1);
    expect(mockedCardReviewSave).to.have.been.called;
    expect(mockedSessionSave).to.have.been.called;
  });

  it("Tests POST /cards/:cardId/edit", async () => {
    process.env.JWT_SECRET = "test";
    const cardId = new ObjectId().toString();
    const userId = new ObjectId().toString();
    const mockedCardSave = sinon.spy();
    const mockedCollection = {
      _id: new ObjectId().toString(),
      owner: { _id: userId },
    };
    const mockedCard = {
      _id: cardId,
      rectoContent: "testRecto",
      versoContent: "testVerso",
      save: mockedCardSave,
      easinessFactor: 3.8,
      numberReviewed: 10,
      priority: 12,
      cardCollection: mockedCollection,
    };
    sinon.mock(jwt).expects("verify").returns({ userId: userId });
    sinon.mock(Card).expects("getCard").resolves(mockedCard);
    await request(app)
      .post(`/cards/${cardId}/edit`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send({
        rectoContent: "testRectoEdited",
        versoContent: "testVersoEdited",
      })
      .expect(200);
    expect(mockedCardSave).to.have.been.called;
    expect(mockedCard.easinessFactor).equal(2.5);
    expect(mockedCard.priority).equal(1);
    expect(mockedCard.numberReviewed).equal(0);
    expect(mockedCard).not.to.have.property("lastReviewed");
  });

  afterEach(() => {
    sinon.restore();
  });
});

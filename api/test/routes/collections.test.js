import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import app from "../../server.js";
import CardCollection from "../../models/cardCollection.js";
import Card from "../../models/card.js";
import DailySession from "../../models/dailySession.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

describe("Test the collections endpoints of the API.", () => {
  it("Tests GET /collections", async () => {
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
      .get("/collections")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property(
      "cardCollections",
      mockedCollections
    );
    expect(response.body).to.have.property("totalCollections", 10);
  });

  it("Tests GET /collections with page param", async () => {
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
      .get("/collections?offset=2&limit=5")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property(
      "cardCollections",
      mockedCollections
    );
    expect(response.body).to.have.property("totalCollections", 10);
  });

  it("Tests GET /collections/:collectionId/cards", async () => {
    process.env.JWT_SECRET = "test";
    const collectionId = new ObjectId().toString();
    const mockedCards = [
      { _id: new ObjectId().toString(), name: "card1" },
      { _id: new ObjectId().toString(), name: "card2" },
    ];
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon.mock(Card).expects("getCards").resolves(mockedCards);
    sinon.mock(Card).expects("count").resolves(2);
    const response = await request(app)
      .get(`/collections/${collectionId}/cards`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.property("totalCards", 2);
    expect(response.body).to.have.deep.property("cards", mockedCards);
  });

  it("Tests GET /collections/:collectionId/cards with page param", async () => {
    process.env.JWT_SECRET = "test";
    const collectionId = new ObjectId().toString();
    const mockedCards = [
      { _id: new ObjectId().toString(), name: "card1" },
      { _id: new ObjectId().toString(), name: "card2" },
    ];
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon.mock(Card).expects("getCards").resolves(mockedCards);
    sinon.mock(Card).expects("count").resolves(2);
    const response = await request(app)
      .get(`/collections/${collectionId}/cards?offset=2&limit=5`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.property("totalCards", 2);
    expect(response.body).to.have.deep.property("cards", mockedCards);
  });

  it("Tests GET /collections/:collectionId/cards-to-review without existing session", async () => {
    process.env.JWT_SECRET = "test";
    const collectionId = new ObjectId().toString();
    const mockedNewCards = [
      { _id: new ObjectId().toString(), name: "card1" },
      { _id: new ObjectId().toString(), name: "card2" },
    ];
    const mockedReviewCards = [
      { _id: new ObjectId().toString(), name: "card3" },
      { _id: new ObjectId().toString(), name: "card4" },
    ];
    const mockedCollection = {
      _id: collectionId.toString(),
      reviewPolicy: {
        newCardsPerDay: 2,
        reviewCardsPerDay: 3,
      },
    };
    const userId = new ObjectId();
    sinon.mock(jwt).expects("verify").returns({ userId: userId.toString() });
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    const mockedCallNewCards = sinon.spy(() => Promise.resolve(mockedNewCards));
    sinon.stub(Card, "getCards").callsFake(mockedCallNewCards);
    const mockedCallReviewCards = sinon.spy(() =>
      Promise.resolve(mockedReviewCards)
    );
    const mockedFindCallReviewCards = {
      limit: () => {
        return {
          sort: () => {
            return {
              exec: mockedCallReviewCards,
            };
          },
        };
      },
    };
    sinon.mock(Card).expects("find").returns(mockedFindCallReviewCards);
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
    const response = await request(app)
      .get(`/collections/${collectionId}/cards-to-review`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property("cards", [
      ...mockedNewCards,
      ...mockedReviewCards,
    ]);
    expect(mockedCallNewCards).to.have.been.calledWith(
      {
        cardCollection: {
          _id: new ObjectId(collectionId),
          user: { _id: userId },
        },
        lastReviewed: { $exists: false },
      },
      0,
      mockedCollection.reviewPolicy.newCardsPerDay
    );
  });

  it("Tests GET /collections/:collectionId/cards-to-review with existing session", async () => {
    process.env.JWT_SECRET = "test";
    const collectionId = new ObjectId().toString();
    const mockedNewCards = [
      { _id: new ObjectId().toString(), name: "card1" },
      { _id: new ObjectId().toString(), name: "card2" },
    ];
    const mockedReviewCards = [
      { _id: new ObjectId().toString(), name: "card3" },
      { _id: new ObjectId().toString(), name: "card4" },
    ];
    const mockedCollection = {
      _id: collectionId.toString(),
      reviewPolicy: {
        newCardsPerDay: 2,
        reviewCardsPerDay: 2,
      },
    };
    const userId = new ObjectId();
    sinon.mock(jwt).expects("verify").returns({ userId: userId.toString() });
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    const mockedCallNewCards = sinon.spy(() => Promise.resolve(mockedNewCards));
    sinon.stub(Card, "getCards").callsFake(mockedCallNewCards);
    const mockedCallReviewCards = sinon.spy(() =>
      Promise.resolve(mockedReviewCards)
    );
    const mockedFindCallReviewCards = {
      limit: () => {
        return {
          sort: () => {
            return {
              exec: mockedCallReviewCards,
            };
          },
        };
      },
    };
    sinon.mock(Card).expects("find").returns(mockedFindCallReviewCards);
    const sessionId = new ObjectId();
    const mockedSession = {
      _id: sessionId,
      numReviews: {
        newCards: 1,
        reviewCards: 1,
      },
    };
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
      .get(`/collections/${collectionId}/cards-to-review`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(mockedCallNewCards).to.have.been.calledWith(
      {
        cardCollection: {
          _id: new ObjectId(collectionId),
          user: { _id: userId },
        },
        lastReviewed: { $exists: false },
      },
      0,
      mockedCollection.reviewPolicy.newCardsPerDay -
        mockedSession.numReviews.newCards
    );
  });

  it("Tests GET /collections/:collectionId", async () => {
    process.env.JWT_SECRET = "test";
    const collectionId = new ObjectId();
    const mockedCollection = {
      _id: collectionId.toString(),
      numCards: 6,
    };
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    const response = await request(app)
      .get(`/collections/${collectionId.toString()}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
    expect(response.body).to.have.deep.property(
      "cardCollection",
      mockedCollection
    );
  });

  it("Tests DELETE /collections/:collectionId", async () => {
    process.env.JWT_SECRET = "test";
    const collectionId = new ObjectId();
    const mockedCollection = {
      _id: collectionId.toString(),
      numCards: 6,
    };
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    sinon
      .mock(CardCollection)
      .expects("deleteCollection")
      .resolves({ message: "Collection deleted and associated cards deleted" });
    sinon.mock(Card).expects("deleteCards").resolves({ message: "ok" });
    await request(app)
      .delete(`/collections/${collectionId.toString()}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .expect(200);
  });

  it("Tests POST /collections", async () => {
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
      .post("/collections")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send(body)
      .expect(201);
    expect(response.body).to.have.property("cardCollection");
  });

  it("Tests POST /collections/:collectionId/edit", async () => {
    process.env.JWT_SECRET = "test";
    const mockedCollectionSave = sinon.spy();
    const mockedCollection = {
      _id: new ObjectId().toString(),
      reviewPolicy: {
        reviewCardsPerDay: 10,
        newCardsPerDay: 10,
      },
      name: "testCollection",
      save: mockedCollectionSave,
    };
    sinon
      .mock(jwt)
      .expects("verify")
      .returns({ userId: new ObjectId().toString() });
    sinon
      .mock(CardCollection)
      .expects("getCollection")
      .resolves(mockedCollection);
    const body = {
      name: "testCollectionEdited",
      newCardsPolicy: "20",
      reviewCardsPolicy: "15",
    };
    const response = await request(app)
      .post(`/collections/${mockedCollection._id}/edit`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer token")
      .send(body)
      .expect(201);
    expect(response.body).to.have.property("collection");
    expect(mockedCollectionSave.calledOnce).to.be.true;
    expect(mockedCollection.name).to.equal("testCollectionEdited");
    expect(mockedCollection.reviewPolicy.reviewCardsPerDay).to.equal(15);
    expect(mockedCollection.reviewPolicy.newCardsPerDay).to.equal(20);
  });

  afterEach(() => {
    sinon.restore();
  });
});

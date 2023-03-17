// import { expect } from "chai";
// import sinon from "sinon";
// import request from "supertest";
// import app from "../../server.js";
// import CardCollection from "../../models/cardCollection.js";
// import Card from "../../models/card.js";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";

// // const Query = mongoose.Query;
// const ObjectId = mongoose.Types.ObjectId;

// describe("Test the collections endpoints of the API.", () => {
//   it("Tests GET /collections", async () => {
//     process.env.JWT_SECRET = "test";
//     const mockedCollections = [
//       { _id: new ObjectId().toString(), name: "collection1" },
//     ];
//     sinon
//       .mock(jwt)
//       .expects("verify")
//       .returns({ userId: new ObjectId().toString() });
//     sinon.mock(CardCollection).expects("countDocs").resolves(10);
//     sinon
//       .mock(CardCollection)
//       .expects("getCollections")
//       .resolves(mockedCollections);
//     const response = await request(app)
//       .get("/collections")
//       .set("Accept", "application/json")
//       .set("Authorization", "Bearer token")
//       .expect(200);
//     expect(response.body).to.have.deep.property(
//       "cardCollections",
//       mockedCollections
//     );
//     expect(response.body).to.have.property("totalCollections", 10);
//   });

//   it("Tests GET /collections with page param", async () => {
//     process.env.JWT_SECRET = "test";
//     const mockedCollections = [
//       { _id: new ObjectId().toString(), name: "collection1" },
//     ];
//     sinon
//       .mock(jwt)
//       .expects("verify")
//       .returns({ userId: new ObjectId().toString() });
//     sinon.mock(CardCollection).expects("countDocs").resolves(10);
//     sinon
//       .mock(CardCollection)
//       .expects("getCollections")
//       .resolves(mockedCollections);
//     const response = await request(app)
//       .get("/collections?offset=2&limit=5")
//       .set("Accept", "application/json")
//       .set("Authorization", "Bearer token")
//       .expect(200);
//     expect(response.body).to.have.deep.property(
//       "cardCollections",
//       mockedCollections
//     );
//     expect(response.body).to.have.property("totalCollections", 10);
//   });

//   it("Tests GET /collections/:collectionId", async () => {
//     process.env.JWT_SECRET = "test";
//     const collectionId = new ObjectId();
//     const mockedCollection = {
//       _id: collectionId.toString(),
//       title: "test",
//       numCards: 6,
//     };
//     sinon
//       .mock(jwt)
//       .expects("verify")
//       .returns({ userId: new ObjectId().toString() });
//     sinon
//       .mock(CardCollection)
//       .expects("getCollection")
//       .resolves(mockedCollection);
//     const response = await request(app)
//       .get(`/collections/${collectionId.toString()}`)
//       .set("Accept", "application/json")
//       .set("Authorization", "Bearer token")
//       .expect(200);
//     expect(response.body).to.have.deep.property(
//       "cardCollection",
//       mockedCollection
//     );
//   });

//   it("Tests DELETE /collections/:collectionId", async () => {
//     process.env.JWT_SECRET = "test";
//     const collectionId = new ObjectId();
//     const mockedCollection = {
//       _id: collectionId.toString(),
//       title: "test",
//       numCards: 6,
//     };
//     sinon
//       .mock(jwt)
//       .expects("verify")
//       .returns({ userId: new ObjectId().toString() });
//     sinon
//       .mock(CardCollection)
//       .expects("getCollection")
//       .resolves(mockedCollection);
//     sinon
//       .mock(CardCollection)
//       .expects("deleteCollection")
//       .resolves({ message: "Collection deleted and associated cards deleted" });
//     sinon.mock(Card).expects("deleteCards").resolves({ message: "ok" });
//     await request(app)
//       .delete(`/collections/${collectionId.toString()}`)
//       .set("Accept", "application/json")
//       .set("Authorization", "Bearer token")
//       .expect(200);
//   });

//   it("Tests POST /collections", async () => {
//     process.env.JWT_SECRET = "test";
//     sinon
//       .mock(jwt)
//       .expects("verify")
//       .returns({ userId: new ObjectId().toString() });
//     sinon
//       .mock(CardCollection.prototype)
//       .expects("save")
//       .resolves({ message: "ok" });
//     const body = {
//       name: "exampleName",
//       description: "exampleDescription",
//     };
//     const response = await request(app)
//       .post("/collections")
//       .set("Accept", "application/json")
//       .set("Authorization", "Bearer token")
//       .send(body)
//       .expect(201);
//     expect(response.body).to.have.property("cardCollection");
//   });

//   afterEach(() => {
//     sinon.restore();
//   });
// });

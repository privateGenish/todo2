const app = require("../../app");
const supertest = require("supertest");
const { expect } = require("chai");
const getFirebaseToken = require("../methods/getFirebaseToken");

describe("/api/user", () => {
  describe("GET /:uid", () => {
    it("should get public data", async () => {
      const expectedItem = {
        Item: {
          Lists: { public: ["LIST#<LID1>", "LIST#<LID2>"] },
          About: "@the.real.genish",
          Name: "TRG",
        },
      };
      const publicDataRequest = await supertest(app).get("/api/user/cihRZfdoynd5qSMLIUFuqUAuPZg1");
      expect(publicDataRequest.body).to.be.deep.equals(expectedItem);
      expect(publicDataRequest.statusCode).to.be.equal(200);
    });
    it("should get private data", async () => {
      const token = await getFirebaseToken("test@test.com", "test1234");
      const expectedItem = {
        Item: {
          Lists: { public: ["LIST#<LID1>", "LIST#<LID2>"], private: ["LIST#<LID3>"] },
          PK: "USER#cihRZfdoynd5qSMLIUFuqUAuPZg1",
          About: "@the.real.genish",
          Name: "TRG",
          Email: "test@test.com",
          LikedLists: ["LIST#<LID3>"],
        },
      };
      const publicDataRequest = await supertest(app).get("/api/user/cihRZfdoynd5qSMLIUFuqUAuPZg1").set("Authorization", token);
      expect(publicDataRequest.body).to.be.deep.equals(expectedItem);
      expect(publicDataRequest.statusCode).to.be.equal(200);
    });
  });
});

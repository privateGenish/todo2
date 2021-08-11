const { expect } = require("chai");
const supertest = require("supertest");

describe.skip("/api", () => {
  this.app = require("../../app");
  before(async () => {
    this.GET = await supertest(this.app).get("/api");
  });
  it('should response with ["Hello World" 200]', async () => {
    expect(this.GET.statusCode).to.equal(200);
    expect(this.GET.text).to.equal("Hello World!");
  });
});

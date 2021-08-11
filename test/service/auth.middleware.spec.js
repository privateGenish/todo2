const getToken = require("../methods/getFirebaseToken");
const createFirebaseUser = require("../methods/createFirebaseUser");
const access = require("../../cache/access.sqlite");
const chai = require("chai");
const auth_middleware = require("../../api/services/auth.middleware");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const expect = chai.expect;
chai.use(require("sinon-chai"));
describe("auth.middleware", () => {
  const res = {
    send: (obj) => {
      return {
        statusCode: 200,
        body: obj,
      };
    },
    status: (status) => {
      return {
        send: (obj) => {
          return {
            statusCode: status,
            body: obj,
          };
        },
      };
    },
  };
  describe(".readUser", () => {
    before(async () => {
      this.token = await getToken("test@test.com", "test1234");
    });
    beforeEach(() => {
      res.locals = {};
    });
    it("should pass res.locals.private = true", async () => {
      const req = {
        headers: {
          authorization: this.token,
        },
        params: {
          uid: "cihRZfdoynd5qSMLIUFuqUAuPZg1",
        },
      };
      const next = sinon.stub().returns(function () {});
      await auth_middleware.readUser(req, res, next);

      expect(res.locals.private).to.be.true;
      expect(next).to.be.calledOnce;
    });
    it("should pass res.local.private = false, bad uid", async () => {
      const req = {
        headers: {
          authorization: this.token,
        },
        params: {},
      };
      const next = sinon.stub().returns(function () {});
      await auth_middleware.readUser(req, res, next);

      expect(res.locals.private).to.be.false;
      expect(next).to.be.calledOnce;
    });
    it("should pass res.local.private = false, bad token", async () => {
      res.local = {};

      const req = {
        headers: {
          authorization: "token",
        },
        params: {
          uid: "cihRZfdoynd5qSMLIUFuqUAuPZg1",
        },
      };
      const next = sinon.stub().returns(function () {});
      await auth_middleware.readUser(req, res, next);

      expect(res.locals.private).to.be.false;
      expect(next).to.be.calledOnce;
    });
    it("should return error[500]", async () => {
      const req = {
        headers: {
          authorization: this.token,
        },
        params: {
          uid: "cihRZfdoynd5qSMLIUFuqUAuPZg1",
        },
      };

      //test: injecting an error
      const next = function () {
        throw Error();
      };

      const response = await auth_middleware.readUser(req, res, next);
      expect(response).to.be.deep.equal({
        statusCode: 500,
        body: {
          error: "Internal Server Error",
        },
      });
    });
  });
  describe(".registerUser", () => {
    before(async () => {
      this.user = await createFirebaseUser("registerUser@test.com", "test1234");
    });
    beforeEach(async () => {
      res.locals = { crash_test: undefined };
      await access.releaseRegisterDenied(this.user.uid);
    });
    afterEach(() => sinon.restore());
    //FIXME: fix [deleteFirebaseUser] error.
    // after(async () => await deleteFirebaseUser(admin, this.user.uid));
    it("should next()", async () => {
      const req = {
        headers: {
          authorization: this.user.token,
        },
        body: {
          uid: this.user.uid,
        },
      };
      const next = sinon.stub().callsFake(() => {
        return "next";
      });
      const response = await auth_middleware.registerUser(req, res, next);
      expect(response).to.be.equal("next");
      expect(next).to.be.calledOnce;
    });
    it("should return lock", async () => {
      res.locals = { crash_test: true };
      const req = {
        headers: {
          authorization: this.user.token,
        },
        body: {
          uid: this.user.uid,
        },
      };
      const next = sinon.stub().callsFake(() => {
        return "next";
      });
      await auth_middleware.registerUser(req, res, next);
      const response = await auth_middleware.registerUser(req, res, next);
      expect(response).to.contain({
        statusCode: 423,
      });
      expect(next).to.be.callCount(0);
    });
    it("should return access denied 401", async () => {
      const req = {
        headers: {
          authorization: undefined,
        },
        body: {
          uid: this.user.uid,
        },
      };
      const next = sinon.stub().callsFake(() => {
        return "next";
      });
      const response = await auth_middleware.registerUser(req, res, next);
      expect(response).to.be.deep.equals({
        statusCode: 401,
        body: {
          error: "Access denied",
        },
      });
    });
  });
  describe(".writeUser", async () => {
    before(async () => {
      this.token = await getToken("test@test.com", "test1234");
    });
    it("should pass done()", async () => {
      const req = {
        headers: {
          authorization: this.token,
        },
        params: {
          uid: "cihRZfdoynd5qSMLIUFuqUAuPZg1",
        },
      };
      const next = sinon.stub().returns(function () {});
      await auth_middleware.writeUser(req, res, next);
      expect(next).to.be.calledOnce;
    });
    it("should return 400", async () => {
      // const req = {
      //   headers: {},
      //   params: {},
      // };
      const req = {};
      const next = sinon.stub().returns(function () {});
      const response = await auth_middleware.writeUser(req, res, next);
      expect(response).to.be.deep.equal({
        statusCode: 400,
        body: {
          error: "Bad request",
        },
      });
    });
    it("should return error[500]", async () => {
      const req = {
        headers: {
          authorization: this.token,
        },
        params: {
          uid: "cihRZfdoynd5qSMLIUFuqUAuPZg1",
        },
      };

      //test: injecting an error
      const next = function () {
        throw Error();
      };

      const response = await auth_middleware.writeUser(req, res, next);
      expect(response).to.be.deep.equal({
        statusCode: 500,
        body: {
          error: "Internal Server Error",
        },
      });
    });
  });
});

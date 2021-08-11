const chai = require("chai");
const user_service = require("../../api/services/user.service");
const { deleteTestUser, createTestUser } = require("../methods/createTestUser");
const { signInFirebaseUser } = require("../methods/firebaseUser");
const sinon = require("sinon");
const expect = chai.expect;
chai.use(require("sinon-chai"));

describe("user.service", () => {
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
  describe(".getUser", () => {
    before(() => {
      const user_controller = require("../../api/controllers/user.controller");
      this.private = sinon.stub(user_controller, "getUser").returns("private data");
      this.public = sinon.stub(user_controller, "getUserPublicData").returns("public data");
    });
    beforeEach(() => {
      res.locals = undefined;
    });
    it("should return private data", async () => {
      res.locals = { private: true };
      const req = {
        params: {
          uid: "some_uid",
        },
      };

      const response = await user_service.getUser(req, res);
      expect(response).to.be.deep.equal({
        statusCode: 200,
        body: "private data",
      });
      expect(this.private).to.be.calledOnce;
    });
    it("should return public data", async () => {
      res.locals = { private: false };
      const req = {
        params: {
          uid: "some_uid",
        },
      };
      const response = await user_service.getUser(req, res);
      expect(response).to.be.deep.equal({
        statusCode: 200,
        body: "public data",
      });
      expect(this.public);
    });
  });
  describe(".register", () => {
    before(() => {
      this.user = { uid: "registerUID", name: "register", email: "register@test.com" };
    });
    it("should return [201 created]", async () => {
      const req = {
        body: this.user,
      };
      const response = await user_service.register(req, res);
      expect(response).to.be.deep.equals({
        statusCode: 201,
        body: {
          message: "User has created successfully",
          User: this.user,
        },
      });
    });
    it("should return [405]", async () => {
      const req = {
        body: this.user,
      };
      await user_service.register(req, res);
      const response = await user_service.register(req, res);
      expect(response).to.be.deep.equals({
        statusCode: 405,
        body: {
          error: "uid is already exists",
        },
      });
    });
    after(async () => {
      await deleteTestUser(this.user.uid, this.user.name, this.user.name);
    });
  });
  describe.only(".deleteUser", function () {
    this.timeout(50000);
    before(async () => {
      this.firebaseUser = await signInFirebaseUser("delete@test.com", "11223344");
      console.log(this.firebaseUser.uid);
      this.user = await createTestUser(this.firebaseUser.uid);
      console.log(this.user);
    });
    it.only("should delete this shit", async () => {
      req = {
        headers: { token: this.firebaseUser.token },
        params: { uid: this.firebaseUser.uid },
      };
      await user_service.deleteUser(req,res);
    });
    it("should return 200", async () => {
      const req = {
        params: {
          uid: this.firebaseUser.uid,
        },
      };
      const response = await user_service.deleteUser(req, res);
      expect(response).to.be.deep.equal({
        statusCode: 200,
        body: {
          message: "User has deleted successfully",
          User: {
            uid: req.params.uid,
          },
        },
      });
    });
    it("should return 400", async () => {
      req = {
        params: {
          uid: "deleteUser",
        },
      };
      const response = await user_service.deleteUser(req, res);
      console.log(response);
    });
  });
});

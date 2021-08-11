const { expect } = require("chai");
const api_service = require("../../api/services/api.service");
describe.skip("api.service", async () => {
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
  const req = {};
  describe(".helloWorld", async () => {
    it('should send ["Hello World" ,200]', async () => {
      const response = await api_service.helloWorld(req, res);
      expect(response).to.be.deep.equal({
        statusCode: 200,
        body: "Hello World!",
      });
    });
  });
});

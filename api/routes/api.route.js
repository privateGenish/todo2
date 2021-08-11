const apiRouter = require("express").Router();
const api_service = require("../services/api.service");
const userRouter = require("../routes/user.route");

apiRouter.get("", api_service.helloWorld);

apiRouter.use("/user", userRouter);

module.exports = apiRouter;

const userRouter = require("express").Router();
const auth = require("../services/auth.middleware");
const user_services = require('../services/user.service')

userRouter.get("/:uid", auth.readUser, user_services.getUser);
userRouter.post("/register", user_services.register)
userRouter.delete("/:uid", auth.writeUser, user_services.deleteUser)

module.exports = userRouter;

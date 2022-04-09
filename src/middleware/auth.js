const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wrapper");
const redis = require("../config/redis")

module.exports = {
  authentication: async (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "Please login first!", null);
    }
    token = token.split(" ")[1];
    const checkRedis = await redis.get(`accessToken:${token}`);
    if(checkRedis){
      return helperWrapper.response(response, 403, "Your Token is destroyed, please login again")
    }
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(response, 400, error.massage, null);
      }
      request.decodeToken = result;
      next();
    });
  },
  isAdmin: (request, response, next) => {
    let token = request.headers.authorization;
    token = token.split(" ")[1];
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(response, 400, error.massage, null);
      }
      if (result.role !== "admin") {
        return helperWrapper.response(
          response,
          403,
          "only admins are allowed to access",
          null
        );
      }
      request.decodeToken = result;
      next();
    });
  },
};

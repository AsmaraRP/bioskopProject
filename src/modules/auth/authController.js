const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");
const { sendMail } = require("../../helper/mail");
const redis = require("../../config/redis");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, lastName, email, password, noTelp } = request.body;
      // encryption
      const passwordHash = bcrypt.hashSync(password, 10);
      // email verivication
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length > 0) {
        return helperWrapper.response(
          response,
          409,
          "Email has been registed",
          null
        );
      }
      const setData = {
        id : uuidv4(),
        firstName,
        lastName,
        image: "",
        noTelp,
        email,
        password: passwordHash,
        role: "user",
        status: "NonActive",
      };
      const result = await authModel.register(setData);
      const setSendEmail = {
        to: email,
        subject: "Email Verification !",
        name: firstName,
        template: 'verificationEmail.html',
        buttonUrl: "google.com"
      }
      const resultSendMail = await sendMail(setSendEmail);
      console.log(resultSendMail)
      return helperWrapper.response(response, 200, "Succsess Register", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "Email not registed!",
          null
        );
      }
      if (!bcrypt.compareSync(password, checkUser[0].password)) {
        return helperWrapper.response(response, 401, "Wrong Password!", null);
      }
      if (checkUser[0].status !== "active") {
        return helperWrapper.response(
          response,
          401,
          "Please Activate your account",
          null
        );
      }
      // JWT Prossecing
      const payload = checkUser[0];
      delete payload.password;
      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "1h" });
      const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
        expiresIn: "24h",
      });
      return helperWrapper.response(response, 200, "Login Success!", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  activation: async (request, response) => {
    try {
      const { id } = request.params;
      const data = { status: "active" };
      const result = await authModel.activation(id, data);
      return helperWrapper.response(
        response,
        200,
        "Succsess Activation",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  refresh: async (request, response) => {
    try {
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be used",
          null
        );
      }
      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        delete result.iat;
        delete result.exp;
        const token = jwt.sign(result, "RAHASIA", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(result, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};

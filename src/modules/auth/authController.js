const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, lastName, email, password, noTelp } = request.body;
      // encryption
      const passwordHash = bcrypt.hashSync(password, 10);
      // email verivication
      const checkUser = await authModel.getUserByEmail(email);
      const verifiedEmail = checkUser.length > 0 ? checkUser[0].email : "";
      if (verifiedEmail === email) {
        return helperWrapper.response(
          response,
          409,
          "Email has been registed",
          null
        );
      }
      const setData = {
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
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: 'bioskopproject1@gmail.com',
          pass: 'asmara12!',
        },
      });
      const mailOptions = {
        from: "bioskopproject1@gmail.com",
        to: email,
        subject: "activation account (no-reply)",
        text: `localhost:3001/auth/activation/${result.id}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email berhasil dikirim : ${info.response}`);
        }
      });
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
      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "24h" });
      return helperWrapper.response(response, 200, "Login Success!", {
        id: payload.id,
        token,
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
};

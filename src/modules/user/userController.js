const bcrypt = require("bcrypt");
const helperWrapper = require("../../helper/wrapper");
const userModel = require("./userModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getUserByUserId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModel.getUserByUserId(id);
      if (result.length <= 0) {
        return helperWrapper.response(response, 404, "Data user by Id is not found", null);
      }
      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  updateProfile: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await userModel.getUserByUserId(id);
      if (cekId.length <= 0) {
        return helperWrapper.response(response, 404, "Data by Id is not found", null);
      }
      const { firstName, lastName, noTelp, email } = request.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        email,
        role,
        updatedAt: new Date(Date.now()),
      };
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await userModel.updateProfile(id, setData);
      return helperWrapper.response(response, 200, "Success Updating Profile!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  updateImage: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await userModel.getUserByUserId(id);
      if (cekId.length <= 0) {
        return helperWrapper.response(response, 404, "Data user by Id is not found", null);
      }
      let setImage = cekId[0].image;
      if (request.file !== undefined) {
        const prevImage = cekId[0].image.split(".")[0];
        cloudinary.uploader.destroy(prevImage);
        const extImage = request.file.mimetype.split("/")[1];
        const nameImage = request.file.filename;
        setImage = `${nameImage}.${extImage}`;
      }
      const data = {
        image: setImage,
        updatedAt: new Date(Date.now()),
      };
      const result = await userModel.updateProfile(id, data);
      return helperWrapper.response(response, 200, "Success Updating Image!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  updatePassword: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await userModel.getUserByUserId(id);
      if (cekId.length <= 0) {
        return helperWrapper.response(response, 404, "Data by Id is not found", null);
      }
      const { newPassword, confirmPassword } = request.body;
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(response, 401, "confirmation Password is incorrect", null);
      }
      const setData = {
        password: bcrypt.hashSync(newPassword, 10),
        updatedAt: new Date(Date.now()),
      };
      const result = await userModel.updateProfile(id, setData);
      return helperWrapper.response(response, 200, "Success Updating Password!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
};

const helperWrapper = require("../../helper/wrapper");
const movieModel = require("./movieModel");
const redis = require("../../config/redis");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = page || 1;
      limit = limit || 5;
      page = Number(page);
      limit = Number(limit);
      const offset = page * limit - limit;
      let { sort, searchName, searchRelease } = request.query;
      searchName = searchName || "";
      sort = sort || "id ASC";
      searchRelease = searchRelease || "";
      const result = await movieModel.getAllMovie(
        limit,
        offset,
        searchName,
        sort,
        searchRelease
      );
      const totalData = await movieModel.getTotalMovie(
        searchName,
        searchRelease
      );
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      redis.setEx(
        `getMovie${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );
      return helperWrapper.response(
        response,
        200,
        "Success get data!",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  getMovieById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "Data by Id is not found",
          null
        );
      }
      redis.setEx(`getMovie${id}`, 3600, JSON.stringify(result));
      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  createMovie: async (request, response) => {
    try {
      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = request.body;
      const extImage = request.file.mimetype.split("/")[1];
      const nameImage = request.file.filename;
      const setImage = `${nameImage}.${extImage}`;
      const setData = {
        name,
        category,
        image: setImage,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
        createdAt: new Date(Date.now()),
      };
      const result = await movieModel.createMovie(setData);
      return helperWrapper.response(
        response,
        200,
        "Success create data Movie!",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await movieModel.getMovieById(id);
      if (cekId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "Data by Id is not found",
          null
        );
      }
      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = request.body;
      let setImage = cekId[0].image;
      if (request.file !== undefined) {
        const prevImage = cekId[0].image.split(".")[0];
        cloudinary.uploader.destroy(prevImage);
        const extImage = request.file.mimetype.split("/")[1];
        const nameImage = request.file.filename;
        setImage = `${nameImage}.${extImage}`;
      }
      const setData = {
        name,
        category,
        image: setImage,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
        updatedAt: new Date(Date.now()),
      };
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await movieModel.updateMovie(id, setData);
      return helperWrapper.response(
        response,
        200,
        "Success Updating data!",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  deleteMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "No Data for deleting",
          null
        );
      }
      const prevImage = result[0].image.split(".")[0];
      cloudinary.uploader.destroy(prevImage);
      const newResult = await movieModel.deleteMovie(id);
      return helperWrapper.response(
        response,
        200,
        "Success Deleting data bellow!",
        result,
        newResult.info
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
};

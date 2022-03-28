const helperWrapper = require("../../helper/wrapper");
const movieModel = require("./movieModel");

module.exports = {
  getHello: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      // eslint-disable-next-line prettier/prettier
   return helperWrapper.response(response, 200, "Success get data!", "HELLO WORLD");
    } catch (error) {
      //   console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  getAllMovie: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = page || 1;
      limit = limit || 5;
      page = Number(page);
      limit = Number(limit);
      const offset = page * limit - limit;
      const totalData = await movieModel.getTotalMovie();
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      let { sort, searchName } = request.query;
      searchName = searchName || "";
      sort = sort || "id ASC";
      const result = await movieModel.getAllMovie(
        limit,
        offset,
        searchName,
        sort
      );
      return helperWrapper.response(
        response,
        200,
        "Success get data!",
        result,
        pageInfo
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  getMovieById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);
      if (result.length <= 0) {
        // eslint-disable-next-line prettier/prettier
    return helperWrapper.response(response, 404, "Data by Id is not found", null);
      }
      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
      //   console.log(error);
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
      const setData = {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
        createdAt: new Date(Date.now()),
      };
      const result = await movieModel.createMovie(setData);
      // eslint-disable-next-line prettier/prettier
   return helperWrapper.response(response, 200, "Success create data Movie!", result);
    } catch (error) {
      //   console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await movieModel.getMovieById(id);
      if (cekId.length <= 0) {
        // eslint-disable-next-line prettier/prettier
    return helperWrapper.response(response, 404, "Data by Id is not found", null);
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
      const setData = {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
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
      //   console.log(error);
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
      const newResult = await movieModel.deleteMovie(id);
      // tangkap ID, proses pengecekan ID = berada pada database, buat model dengan query, resolve(id), set response
      return helperWrapper.response(
        response,
        200,
        "Success Deleting data bellow!",
        result,
        newResult.info
      );
    } catch (error) {
      //   console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
};

const helperWrapper = require("../../helper/wrapper");
const scheduleModel = require("./scheduleModel");
const redis = require("../../config/redis");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = page || 1;
      limit = limit || 5;
      page = Number(page);
      limit = Number(limit);
      const offset = page * limit - limit;
      let { searchLocation, sort, searchByMovieId } = request.query;
      searchLocation = searchLocation || "";
      sort = sort || "schedule.id ASC";
      searchByMovieId =
        searchByMovieId !== undefined ? `&& movieId = ${searchByMovieId}` : "";
      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchLocation,
        sort,
        searchByMovieId
      );
      const totalData = await scheduleModel.getTotalSchedule(
        searchLocation,
        searchByMovieId
      );
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      redis.setEx(
        `getSchedule${JSON.stringify(request.query)}`,
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
      return helperWrapper.response(response, 400, "Bad Request!");
    }
  },
  getScheduleById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "Data by Id is not found",
          null
        );
      }
      redis.setEx(`getSchedule${id}`, 3600, JSON.stringify(result));
      return helperWrapper.response(response, 200, "Success get data!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  createSchedule: async (request, response) => {
    try {
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        request.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
        createdAt: new Date(Date.now()),
      };
      const result = await scheduleModel.createSchedule(setData);
      return helperWrapper.response(
        response,
        200,
        "Success create data Schedule!",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request!", null);
    }
  },
  updateSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await scheduleModel.getScheduleById(id);
      if (cekId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "Data by Id is not found",
          null
        );
      }
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        request.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
        updatedAt: new Date(Date.now()),
      };
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await scheduleModel.updateSchedule(id, setData);
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
  deleteSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          "No Data for deleting",
          null
        );
      }
      const newResult = await scheduleModel.deleteSchedule(id);
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

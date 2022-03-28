const helperWrapper = require("../../helper/wrapper");
const scheduleModel = require("./scheduleModel");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = Number(page);
      limit = Number(limit);
      const offset = page * limit - limit;
      const totalData = await scheduleModel.getTotalSchedule();
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      const { searchLocation, sort } = request.query;
      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchLocation,
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
      //   console.log(error);
      return helperWrapper.response(response, 400, "Bad Request!");
    }
  },
  getScheduleById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);
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
};

import { SPM02V2Model } from "../models/device-models.js";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error.js";

class SPM02V2Controller {
  async getLatestMessages(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Wrong request", errors.array()));
      }
      const minutes = req.query["minutes"];
      const hex = req.query["selected-device"];

      const startTime = new Date(Date.now() - minutes * 60 * 1000);
      const data = await SPM02V2Model.find({ hex, time: { $gte: startTime } })
        .select("-_id")
        .sort({ time: "desc" });

      const interval = Math.ceil(data.length / 1000); //1000 - maximum number of records returned to client, excess data is evenly skipped
      const formattedData = data.filter((_, index) => index % interval === 0);

      res.json(formattedData);
    } catch (err) {
      return next(err);
    }
  }

  async getMessagesByTimeRange(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Wrong request", errors.array()));
      }
      const hex = req.query["selected-device"];
      const startTime = req.query["start-time"];
      const endTime = req.query["end-time"];

      const data = await SPM02V2Model.find({ hex, time: { $gte: startTime, $lte: endTime } })
        .select("-_id")
        .sort({ time: "desc" });

      const interval = Math.ceil(data.length / 1000); //1000 - maximum number of records returned to client, excess data is evenly skipped
      const formattedData = data.filter((_, index) => index % interval === 0);

      res.json(formattedData);
    } catch (err) {
      return next(err);
    }
  }
}

export default new SPM02V2Controller();

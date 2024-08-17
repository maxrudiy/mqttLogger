import {
  Pj1203awInstModel,
  Pj1203awTotalModel,
} from "../models/pj1203aw-models.js";

class DashboardController {
  async getPj1203awData(req, res, next) {
    try {
      const dataInst = await Pj1203awInstModel.find()
        .sort({ time: "desc" })
        .limit(20);
      const dataTotal = await Pj1203awTotalModel.find();
      res.json({ dataInst, dataTotal });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new DashboardController();

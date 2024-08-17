import {
  Pj1203awInstantaneousModel,
  Pj1203awCumulativeModel,
} from "../models/pj1203aw-models.js";

class DashboardController {
  async getPj1203awData(req, res, next) {
    try {
      const dataInstantaneous = await Pj1203awInstantaneousModel.find()
        .sort({ time: "desc" })
        .limit(20);
      const dataCumulative = await Pj1203awCumulativeModel.find();
      res.json({ dataInstantaneous, dataCumulative });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new DashboardController();

import { Pj1203awInstModel, Pj1203awTotalModel } from "../models/pj1203aw-models.js";

const initialData = {
  powerTotal: 0,
  powerA: 0,
  powerB: 0,
  powerDirectionA: 0,
  powerDirectionB: 0,
  powerFactorA: 0,
  powerFactorB: 0,
  powerFreq: 0,
  voltage: 0,
  currentA: 0,
  currentB: 0,
  forwardEnergyTotalA: 0,
  reverseEnergyTotalA: 0,
  forwardEnergyTotalB: 0,
  reverseEnergyTotalB: 0,
};

class DashboardController {
  async getPj1203awData(req, res, next) {
    try {
      const dataInst = await Pj1203awInstModel.find().sort({ time: "desc" }).limit(20);
      const dataTotal = await Pj1203awTotalModel.find();
      res.json({ dataInst, dataTotal });
    } catch (err) {
      console.log(err);
    }
  }
  async getMessages(req, res, next) {
    try {
      const dataInstLatest = await Pj1203awInstModel.find().sort({ time: "desc" }).limit(1);
      const dataTotalLatest = await Pj1203awTotalModel.find().sort({ time: "desc" }).limit(1);

      const updatedInitialData = {};
      for (const key in initialData) {
        updatedInitialData[key] = dataInstLatest[0][key] !== undefined ? dataInstLatest[0][key] : dataTotalLatest[0][key];
      }
      res.json(updatedInitialData);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new DashboardController();

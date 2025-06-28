import { SPM02V2Model } from "../models/devices-models.js";

const initialData = {
  powerFactor: 0,
  acFrequency: 0,
  voltageX: 0,
  currentX: 0,
  powerX: 0,
  voltageY: 0,
  currentY: 0,
  powerY: 0,
  voltageZ: 0,
  currentZ: 0,
  powerZ: 0,
  power: 0,
  energy: 0,
  producedEnergy: 0,
  model: "",
};

class DashboardController {
  async getSPM02V2LatestHistory(req, res, next) {
    try {
      const { history } = req.params;

      const data = await SPM02V2Model.find()
        .select([
          "model",
          "energy",
          "producedEnergy",
          "voltageX",
          "currentX",
          "powerX",
          "voltageY",
          "currentY",
          "powerY",
          "voltageZ",
          "currentZ",
          "powerZ",
          "power",
          "time",
          "-_id",
        ])
        .sort({ time: "desc" })
        .limit(Number(history) >= 3600 ? 3600 : history);

      res.json(data);
    } catch (err) {
      console.log(err);
    }
  }
  async getSPM02V2LatestMessage(req, res, next) {
    try {
      const dataLatest = await SPM02V2Model.find().sort({ time: "desc" }).limit(1);

      const updatedInitialData = {};
      for (const key in initialData) {
        if (dataLatest[0][key] !== undefined) updatedInitialData[key] = dataLatest[0][key];
      }
      res.json(updatedInitialData);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new DashboardController();

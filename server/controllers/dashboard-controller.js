import { SPM02V2Model } from "../models/devices-models.js";

class SPM02V2Controller {
  async getLatestMessages(req, res, next) {
    try {
      const minutes = parseInt(req.params.minutes);

      if (isNaN(minutes) || minutes <= 0) {
        return res.status(400).json({ error: "Invalid minutes parameter" });
      }
      const sinceTime = new Date(Date.now() - minutes * 60 * 1000);

      const data = await SPM02V2Model.find({ time: { $gte: sinceTime } })
        .select("-_id")
        .sort({ time: "desc" });

      res.json(data);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new SPM02V2Controller();

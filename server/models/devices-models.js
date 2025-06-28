import { model, Schema } from "mongoose";

const SPM02V2Schema = new Schema({
  model: String,
  energy: Number,
  producedEnergy: Number,
  powerFactor: Number,
  acFrequency: Number,
  voltageX: Number,
  currentX: Number,
  powerX: Number,
  voltageY: Number,
  currentY: Number,
  powerY: Number,
  voltageZ: Number,
  currentZ: Number,
  powerZ: Number,
  power: Number,
  time: { type: Schema.Types.Date, default: () => Date.now() },
});

const SPM02V2Model = model("SPM02V2", SPM02V2Schema);

export { SPM02V2Model };

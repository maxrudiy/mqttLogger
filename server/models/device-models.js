import { model, Schema } from "mongoose";

const SPM02V2Schema = new Schema({
  name: String,
  hex: String,
  energy: Number,
  producedEnergy: Number,
  x: String,
  y: String,
  z: String,
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

const PJ1203AWSchema = new Schema({
  name: String,
  hex: String,
  energyFlowA: String,
  voltage: Number,
  currentA: Number,
  powerA: Number,
  powerFactorA: Number,
  acFrequency: Number,
  powerAB: Number,
  energyFlowB: String,
  currentB: Number,
  powerB: Number,
  powerFactorB: Number,
  energyA: Number,
  producedEnergyA: Number,
  energyB: Number,
  producedEnergyB: Number,
  time: { type: Schema.Types.Date, default: () => Date.now() },
});

const SPM02V2Model = model("SPM02V2", SPM02V2Schema);
const PJ1203AWModel = model("PJ1203AW", PJ1203AWSchema);

export { SPM02V2Model, PJ1203AWModel };

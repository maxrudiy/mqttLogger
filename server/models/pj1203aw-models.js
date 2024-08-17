import { model, Schema } from "mongoose";

const Pj1203awInstSchema = new Schema({
  powerTotal: Number,
  powerA: Number,
  powerB: Number,
  powerDirectionA: Number,
  powerDirectionB: Number,
  powerFactorA: Number,
  powerFactorB: Number,
  powerFreq: Number,
  voltage: Number,
  currentA: Number,
  currentB: Number,
  time: { type: Schema.Types.Date, default: () => Date.now() },
});

const Pj1203awTotalSchema = new Schema({
  forwardEnergyTotalA: Number,
  reverseEnergyTotalA: Number,
  forwardEnergyTotalB: Number,
  reverseEnergyTotalB: Number,
  time: { type: Schema.Types.Date, default: () => Date.now() },
});

const Pj1203awInstModel = model("Pj1203awInst", Pj1203awInstSchema);
const Pj1203awTotalModel = model("Pj1203awTotal", Pj1203awTotalSchema);

export { Pj1203awInstModel, Pj1203awTotalModel };

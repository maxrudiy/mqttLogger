import { model, Schema } from "mongoose";

const Pj1203awInstantaneousSchema = new Schema({
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

const Pj1203awCumulativeSchema = new Schema({
  forwardEnergyTotalA: Number,
  reverseEnergyTotalA: Number,
  forwardEnergyTotalB: Number,
  reverseEnergyTotalB: Number,
  time: { type: Schema.Types.Date, default: () => Date.now() },
});

const Pj1203awInstantaneousModel = model(
  "Pj1203awInstantaneous",
  Pj1203awInstantaneousSchema
);
const Pj1203awCumulativeModel = model(
  "Pj1203awCumulative",
  Pj1203awCumulativeSchema
);

export { Pj1203awInstantaneousModel, Pj1203awCumulativeModel };

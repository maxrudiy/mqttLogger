const divideBy10 = (value) => {
  if (!Number.isInteger(value)) value = parseInt(value);
  return value / 10;
};
const divideBy100 = (value) => {
  if (!Number.isInteger(value)) value = parseInt(value);
  return value / 100;
};
const divideBy1000 = (value) => {
  if (!Number.isInteger(value)) value = parseInt(value);
  return value / 1000;
};
const raw = (value) => value;

const unsignedToSigned = (value) => {
  if (!Number.isInteger(value)) value = parseInt(value);
  if (value >= 0x80000000) {
    //Check if the sign bit is set >= 2^31
    return value - 0x100000000; //Subtract 2^32 to get the negative value
  }
  return value;
};

const deviceLibrary = [
  {
    model: "SPM02V2",
    checkPattern: /[0-9a-f]{4}[\/?][0-9a-f]{2,4}/i,
    dataPoints: {
      1: { prop: "energy", func: [divideBy100] },
      2: { prop: "producedEnergy", func: [divideBy100] },
      6: { prop: "x", func: [raw] },
      7: { prop: "y", func: [raw] },
      8: { prop: "z", func: [raw] },
      15: { prop: "powerFactor", func: [raw] },
      101: { prop: "acFrequency", func: [divideBy100] },
      102: { prop: "voltageX", func: [divideBy10] },
      103: { prop: "currentX", func: [unsignedToSigned, divideBy1000] },
      104: { prop: "powerX", func: [unsignedToSigned, raw] },
      105: { prop: "voltageY", func: [divideBy10] },
      106: { prop: "currentY", func: [unsignedToSigned, divideBy1000] },
      107: { prop: "powerY", func: [unsignedToSigned, raw] },
      108: { prop: "voltageZ", func: [divideBy10] },
      109: { prop: "currentZ", func: [unsignedToSigned, divideBy1000] },
      110: { prop: "powerZ", func: [unsignedToSigned, raw] },
      111: { prop: "power", func: [raw] },
    },
  },
  {
    model: "PJ1203AW",
    checkPattern: /[0-9a-f]{4}[\/?][0-9a-f]{2,4}/i,
    dataPoints: {
      101: { prop: "powerA", func: [raw] },
      //102: { prop: "energyFlowA", func: [raw] },
      //104: { prop: "energyFlowB", func: [raw] },
      105: { prop: "powerB", func: [raw] },
      106: { prop: "energyA", func: [raw] },
      107: { prop: "producedEnergyA", func: [raw] },
      108: { prop: "energyB", func: [raw] },
      109: { prop: "producedEnergyB", func: [raw] },
      110: { prop: "powerFactorA", func: [raw] },
      111: { prop: "acFrequency", func: [raw] },
      112: { prop: "voltage", func: [raw] },
      113: { prop: "currentA", func: [raw] },
      114: { prop: "currentB", func: [raw] },
      115: { prop: "energy", func: [raw] },
      121: { prop: "powerFactorB", func: [raw] },
    },
  },
];

export { deviceLibrary };

// const info = {
//   multiEndpointSkip: ["power_factor", "power_factor_phase_b", "power_factor_phase_c", "energy"],
//   tuyaDatapoints: [
//     [111, "ac_frequency", tuya.valueConverter.divideBy100],
//     [112, "voltage", tuya.valueConverter.divideBy10],
//     [101, null, convLocal.powerPJ1203A("a")], // power_a
//     [105, null, convLocal.powerPJ1203A("b")], // power_b
//     [113, null, convLocal.currentPJ1203A("a")], // current_a
//     [114, null, convLocal.currentPJ1203A("b")], // current_b
//     [110, null, convLocal.powerFactorPJ1203A("a")], // power_factor_a
//     [121, null, convLocal.powerFactorPJ1203A("b")], // power_factor_b
//     [102, null, convLocal.energyFlowPJ1203A("a")], // energy_flow_a or the sign of power_a
//     [104, null, convLocal.energyFlowPJ1203A("b")], // energy_flow_b or the sign of power_b
//     [115, null, convLocal.powerAbPJ1203A()],
//     [106, "energy_a", tuya.valueConverter.divideBy100],
//     [108, "energy_b", tuya.valueConverter.divideBy100],
//     [107, "energy_produced_a", tuya.valueConverter.divideBy100],
//     [109, "energy_produced_b", tuya.valueConverter.divideBy100],
//     [129, "update_frequency", tuya.valueConverter.raw],
//   ],
// };

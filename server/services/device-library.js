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
    metaPattern: /[0-9a-f]{4}[\/?][0-9a-f]{2,4}/i,
    dataPoints: {
      1: { prop: "energy", func: [divideBy100] },
      2: { prop: "producedEnergy", func: [divideBy100] },
      6: { prop: "x", func: [raw] }, //?
      7: { prop: "y", func: [raw] }, //?
      8: { prop: "z", func: [raw] }, //?
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
    metaPattern: /[0-9a-f]{4}[\/?][0-9a-f]{2,4}/i,
    skipFields: ["energyA", "producedEnergyA", "energyB", "producedEnergyB"],
    dataPoints: {
      //Emitted every update time
      102: { prop: "energyFlowA", func: [raw] }, //? Is not emitted if current = 0
      112: { prop: "voltage", func: [divideBy10] },
      113: { prop: "currentA", func: [divideBy1000] },
      101: { prop: "powerA", func: [divideBy10] },
      110: { prop: "powerFactorA", func: [divideBy100] },
      111: { prop: "acFrequency", func: [divideBy100] },
      115: { prop: "powerAB", func: [divideBy10] },
      104: { prop: "energyFlowB", func: [raw] }, //? Is not emitted if current = 0
      114: { prop: "currentB", func: [divideBy1000] },
      105: { prop: "powerB", func: [divideBy10] },
      121: { prop: "powerFactorB", func: [divideBy100] },
      //Emitted when value changes
      106: { prop: "energyA", func: [divideBy1000] },
      107: { prop: "producedEnergyA", func: [divideBy1000] },
      108: { prop: "energyB", func: [divideBy1000] },
      109: { prop: "producedEnergyB", func: [divideBy1000] },
    },
  },
];

export { deviceLibrary };

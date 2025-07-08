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
    dataPoints: {
      1: { property: "energy", applyFunctions: [divideBy100] },
      2: { property: "producedEnergy", applyFunctions: [divideBy100] },
      6: { property: "x", applyFunctions: [raw] },
      7: { property: "y", applyFunctions: [raw] },
      8: { property: "z", applyFunctions: [raw] },
      15: { property: "powerFactor", applyFunctions: [raw] },
      101: { property: "acFrequency", applyFunctions: [divideBy100] },
      102: { property: "voltageX", applyFunctions: [divideBy10] },
      103: { property: "currentX", applyFunctions: [unsignedToSigned, divideBy1000] },
      104: { property: "powerX", applyFunctions: [unsignedToSigned, raw] },
      105: { property: "voltageY", applyFunctions: [divideBy10] },
      106: { property: "currentY", applyFunctions: [unsignedToSigned, divideBy1000] },
      107: { property: "powerY", applyFunctions: [unsignedToSigned, raw] },
      108: { property: "voltageZ", applyFunctions: [divideBy10] },
      109: { property: "currentZ", applyFunctions: [unsignedToSigned, divideBy1000] },
      110: { property: "powerZ", applyFunctions: [unsignedToSigned, raw] },
      111: { property: "power", applyFunctions: [raw] },
    },
  },
];

export { deviceLibrary };

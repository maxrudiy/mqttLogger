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

const energyFlow = (value) => {
  if (value === "0") return "Forward";
  else if (value === "1") return "Reverse";
};

const deviceLibrary = [
  {
    model: "SPM02V2",
    metaPattern: /[0-9a-f]{4}[\/?][0-9a-f]{2,4}/i,
    dataPoints: {
      1: { prop: "energyXYZ", func: [divideBy100] },
      2: { prop: "producedEnergyXYZ", func: [divideBy100] },
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
      111: { prop: "powerXYZ", func: [raw] },
    },
  },
  {
    model: "PJ1203AW", //Data points: https://github.com/Koenkk/zigbee2mqtt/issues/18419
    metaPattern: /[0-9a-f]{4}[\/?][0-9a-f]{2,4}/i,
    multiEndpointSkip: ["energyA", "producedEnergyA", "energyB", "producedEnergyB"],
    dataPoints: {
      //Emitted every update time
      102: { prop: "energyFlowA", func: [energyFlow, raw] }, //EnergyFlow isn't emitted when current equals 0
      112: { prop: "voltage", func: [divideBy10] },
      113: { prop: "currentA", func: [divideBy1000] },
      101: { prop: "powerA", func: [divideBy10] },
      110: { prop: "powerFactorA", func: [divideBy100] },
      111: { prop: "acFrequency", func: [divideBy100] },
      115: { prop: "powerAB", func: [unsignedToSigned, divideBy10] },
      104: { prop: "energyFlowB", func: [energyFlow, raw] }, //EnergyFlow isn't emitted when current equals 0
      114: { prop: "currentB", func: [divideBy1000] },
      105: { prop: "powerB", func: [divideBy10] },
      121: { prop: "powerFactorB", func: [divideBy100] },
      //Emitted rarely
      106: { prop: "energyA", func: [divideBy1000] },
      107: { prop: "producedEnergyA", func: [divideBy1000] },
      108: { prop: "energyB", func: [divideBy1000] },
      109: { prop: "producedEnergyB", func: [divideBy1000] },
      //129 DPID_UPDATE_RATE 	report/setting 	(1. report the update rate 2. big-endian, (3-60s) 3. unsigned int (32bits)
      //ZbSend {"device":"0x0FBF","Write":{"EF00/0281":10}}
    },
  },
];

export { deviceLibrary };

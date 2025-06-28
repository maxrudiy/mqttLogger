const SPM02V2_DEVICE = process.env.SPM02V2_DEVICE;

const divideBy10 = (value) => parseInt(value) / 10;
const divideBy100 = (value) => parseInt(value) / 100;
const divideBy1000 = (value) => parseInt(value) / 1000;
const raw = (value) => value;

const devicesLibrary = [
  {
    model: "SPM02V2",
    device: SPM02V2_DEVICE,
    dataPoints: {
      1: ["energy", divideBy100],
      2: ["producedEnergy", divideBy100],
      6: ["x", raw],
      7: ["y", raw],
      8: ["z", raw],
      15: ["powerFactor", raw],
      101: ["acFrequency", divideBy100],
      102: ["voltageX", divideBy10],
      103: ["currentX", divideBy1000],
      104: ["powerX", raw],
      105: ["voltageY", divideBy10],
      106: ["currentY", divideBy1000],
      107: ["powerY", raw],
      108: ["voltageZ", divideBy10],
      109: ["currentZ", divideBy1000],
      110: ["powerZ", raw],
      111: ["power", raw],
    },
  },
];

export { devicesLibrary };

const ConvertNegativeValues = (v, phase) => {
  // Support negative power readings
  // https://github.com/Koenkk/zigbee2mqtt/issues/18603#issuecomment-2277697295
  const buf = Buffer.from(v, "base64");
  let power = buf[7] | (buf[6] << 8);
  if (power > 0x7fff) {
    power = (0x999a - power) * -1;
  }

  return {
    [`voltage_${phase}`]: (buf[1] | (buf[0] << 8)) / 10,
    [`current_${phase}`]: (buf[4] | (buf[3] << 8)) / 1000,
    [`power_${phase}`]: power,
  };
};

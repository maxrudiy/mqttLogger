const formatTimeFunc = (time) => new Date(time).toLocaleTimeString("uk", { timeZone: "Europe/Kyiv" });
const toApparentPower3ph = (current, voltage) => Math.round(((Math.sqrt(3) * current) / 1000) * voltage) / 1000;
const toActivePower3ph = (current, voltage, pf) => Math.round(((Math.sqrt(3) * current) / 1000) * voltage * pf) / 1000;

export { formatTimeFunc, toApparentPower3ph, toActivePower3ph };

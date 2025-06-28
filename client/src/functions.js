const formatTimeFunc = (time) => new Date(time).toLocaleTimeString("uk", { timeZone: "Europe/Kyiv" });

export { formatTimeFunc };

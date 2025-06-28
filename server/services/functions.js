const convertFunction = (received, devicesLibrary) => {
  const receivedDeviceId = Object.getOwnPropertyNames(received)[0];
  const libraryDeviceData = devicesLibrary.find((value) => value.device == receivedDeviceId);

  if (!libraryDeviceData) {
    throw new Error(`Device ${receivedDeviceId} not found in library`);
  }

  const id = Object.keys(received[receivedDeviceId]).find((value) => /[0-9a-f]{4}[\/?][0-9a-f]{2,4}/i.test(value)); //Search for "EF00/0265" - cluster id, manufacturer data and data point
  const dp = parseInt(id.slice(-2), 16); // "65" - data point received in message

  if (!libraryDeviceData.dataPoints[dp]) {
    throw new Error(`Data point ${dp} of ${receivedDeviceId} not found in library`);
  }
  const propertyName = libraryDeviceData.dataPoints[dp][0];
  const applyFunction = libraryDeviceData.dataPoints[dp][1];

  return { model: libraryDeviceData.model, propertyName, value: applyFunction(received[receivedDeviceId][id]) };
};

export { convertFunction };

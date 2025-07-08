import fs from "fs";
import path from "path";
import chokidar from "chokidar";

const DEVICE_DEFINITION = JSON.parse(process.env.DEVICE_DEFINITION);

const convertFunction = (received, devicesLibrary) => {
  const receivedHexId = Object.getOwnPropertyNames(received)[0];
  //Search for the model in deviceDefinition by hex id from the received message.
  const definedModelByHex = Object.getOwnPropertyNames(DEVICE_DEFINITION).find((model, index) => Object.hasOwn(DEVICE_DEFINITION[model], receivedHexId));
  if (!definedModelByHex) throw new Error(`Device ${receivedHexId} is not found in device definition`);

  const libraryDeviceData = devicesLibrary.find((device) => device.model == definedModelByHex);
  if (!libraryDeviceData) throw new Error(`Model ${definedModelByHex} not found in library`);

  const { metaPattern, dataPoints } = libraryDeviceData;

  //Search for data point in received message
  const meta = Object.keys(received[receivedHexId]).find((value) => metaPattern.test(value)); //Search for "EF00/0265" - cluster, manufacturer data and data point
  const receivedDp = parseInt(meta.slice(-2), 16); // "65" - data point received in message
  if (!dataPoints[receivedDp]) throw new Error(`Data point ${receivedDp} of ${receivedHexId} not found in library`);

  const property = dataPoints[receivedDp].prop;
  const applyFunctions = dataPoints[receivedDp].func;
  const name = DEVICE_DEFINITION[definedModelByHex][receivedHexId].name;
  let value = received[receivedHexId][meta];

  for (const f of applyFunctions) {
    value = f(value);
  }

  return { name, model: definedModelByHex, hex: receivedHexId, property, value };
};

const getRequiredFields = (model, devicesLibrary) => {
  const dataPoints = Object.values(devicesLibrary.find((item) => item.model === model).dataPoints);
  return dataPoints.map((item) => item.prop);
};

const cleanupDir = (dir) => {
  fs.rm(dir, { recursive: true, force: true }, (err) => {
    if (err) console.error(`Error cleaning up HLS directory ${dir}:`, err);
    else console.log(`Cleaned up HLS directory: ${dir}`);
  });
};

const waitForHLSFiles = (dir, timeout) => {
  return new Promise((resolve, reject) => {
    const watcher = chokidar.watch(dir);

    const timer = setTimeout(() => {
      watcher.close().then(() => console.log("HLS files watcher has been closed"));
      return reject(new Error("Timed out waiting for HLS files"));
    }, timeout);

    watcher.on("add", () => {
      const playlistExists = fs.existsSync(path.join(dir, "index.m3u8"));
      const tsFiles = fs.readdirSync(dir).filter((fileName, index) => fileName.endsWith(".ts"));
      if (playlistExists && tsFiles.length > 0) {
        clearTimeout(timer);
        watcher.close().then(() => console.log("HLS files watcher has been closed"));
        return resolve();
      }
    });
  });
};

export { convertFunction, getRequiredFields, cleanupDir, waitForHLSFiles };

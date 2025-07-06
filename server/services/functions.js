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

  //Search for data point in received message
  const receivedClusterAndDp = Object.keys(received[receivedHexId]).find((value) => /[0-9a-f]{4}[\/?][0-9a-f]{2,4}/i.test(value)); //Search for "EF00/0265" - cluster, manufacturer data and data point
  const receivedDp = parseInt(receivedClusterAndDp.slice(-2), 16); // "65" - data point received in message
  if (!libraryDeviceData.dataPoints[receivedDp]) throw new Error(`Data point ${receivedDp} of ${receivedHexId} not found in library`);

  const property = libraryDeviceData.dataPoints[receivedDp][0];
  const applyFunction = libraryDeviceData.dataPoints[receivedDp][1];
  const name = DEVICE_DEFINITION[definedModelByHex][receivedHexId].name;

  return { name, model: definedModelByHex, hex: receivedHexId, property, value: applyFunction(received[receivedHexId][receivedClusterAndDp]) };
};

const getFieldsByDataPoints = (model, devicesLibrary) => {
  const dataPoints = Object.values(devicesLibrary.find((item) => (item.model = model)).dataPoints);
  return dataPoints.map((item) => item[0]);
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

export { convertFunction, getFieldsByDataPoints, cleanupDir, waitForHLSFiles };

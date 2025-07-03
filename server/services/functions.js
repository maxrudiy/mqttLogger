import fs from "fs";
import path from "path";

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
    const playlistPath = path.join(dir, "index.m3u8");
    const timer = setTimeout(() => reject(new Error("Timed out waiting for HLS files")), timeout);
    const watcher = fs.watch(dir, (event, filename) => {
      if (filename === path.basename(playlistPath)) {
        const playlistExists = fs.existsSync(playlistPath);
        const tsFiles = fs.readdirSync(dir).filter((fileName, index) => fileName.endsWith(".ts"));
        if (playlistExists && tsFiles.length > 0) {
          clearTimeout(timer);
          watcher.close();
          return resolve();
        }
      }
    });
  });
};

export { convertFunction, getFieldsByDataPoints, cleanupDir, waitForHLSFiles };

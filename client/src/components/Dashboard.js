import React, { useState } from "react";
import { Message } from "./message";
import { LatestChart } from "./latest-chart";
import { ByTimeRangeChart } from "./by-time-range-chart";
import { Streams } from "./streams";
import { CameraNames } from "./camera-names";

const Dashboard = () => {
  const [selectedCamera, setSelectedCamera] = useState();

  return (
    <>
      <Message />
      <LatestChart />
      <ByTimeRangeChart />
      <Streams selectedCamera={selectedCamera} />
      <CameraNames setSelectedCamera={setSelectedCamera} />
    </>
  );
};

export { Dashboard };

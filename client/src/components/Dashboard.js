import React, { useState } from "react";
import { Message } from "./Message";
import { LatestChart } from "./LatestChart";
import { ByTimeRangeChart } from "./ByTimeRangeChart";
import { Streams } from "./Streams";
import { CameraNames } from "./CameraNames";

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

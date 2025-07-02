import React from "react";
import { Message } from "./message";
import { LatestChart } from "./latest-chart";
import { ByTimeRangeChart } from "./by-time-range-chart";
import { Stream } from "./stream";

const Dashboard = () => {
  return (
    <>
      <Message />
      <LatestChart />
      <ByTimeRangeChart />
      <Stream />
    </>
  );
};

export { Dashboard };

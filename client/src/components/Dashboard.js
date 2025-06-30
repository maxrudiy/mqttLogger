import React from "react";
import { Message } from "./message";
import { LatestChart } from "./latest-chart";
import { ByTimeRangeChart } from "./by-time-range-chart";

const Dashboard = () => {
  return (
    <>
      <Message />
      <LatestChart />
      <ByTimeRangeChart />
    </>
  );
};

export { Dashboard };

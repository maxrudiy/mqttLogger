import React, { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { useGetMessagesByTimeRangeQuery } from "../api/messages-api-slice";
import Chart from "./Chart";

import "react-datepicker/dist/react-datepicker.css";

const ByTimeRangeChart = () => {
  const { now, localStartOfDay } = useMemo(() => {
    const now = new Date();
    const localStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { now: now.toISOString(), localStartOfDay: localStartOfDay.toISOString() };
  }, []);

  const [queryParams, setQueryParams] = useState({ startTime: localStartOfDay, endTime: now });
  const [timeRange, setTimeRange] = useState([null, null]);
  const [startTime, endTime] = timeRange;

  useEffect(() => {
    if (startTime && endTime) {
      setQueryParams({ startTime: startTime.toISOString(), endTime: endTime.toISOString() });
    }
  }, [startTime, endTime]);

  const { data, isLoading } = useGetMessagesByTimeRangeQuery({ hex: "0x94EF", ...queryParams });

  return (
    <>
      <DatePicker
        selectsRange={true}
        startDate={startTime}
        endDate={endTime}
        onChange={(update) => {
          setTimeRange(update);
        }}
        isClearable={true}
      />
      <p>
        Showing results from <strong>{queryParams.startTime}</strong> to <strong>{queryParams.endTime}</strong>
      </p>
      {!isLoading ? <Chart data={data} skipFields={["acFrequency", "hex", "name", "x", "y", "z"]} /> : "Loading"}
    </>
  );
};

export { ByTimeRangeChart };

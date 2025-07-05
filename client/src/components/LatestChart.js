import React, { useEffect, useState } from "react";
import Chart from "./Chart";

import { useGetLatestMessagesQuery } from "../api/messages-api-slice";
import { useDispatch } from "react-redux";
import { updateLatestMessage } from "../store/latest-message-slice";

const LatestChart = () => {
  const [minutes, setMinutes] = useState(30);
  const { data, isLoading } = useGetLatestMessagesQuery(minutes);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) dispatch(updateLatestMessage(data));
  }, [data, dispatch, isLoading]);

  return (
    <>
      <input type="text" onChange={(event) => setMinutes(event.target.value)} defaultValue={minutes} />
      <Chart data={data} isLoading={isLoading} />
    </>
  );
};

export { LatestChart };

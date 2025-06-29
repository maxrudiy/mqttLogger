import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatTimeFunc } from "../functions";

import { useGetLatestMessagesQuery } from "../api/latest-messages-api-slice";
import { useDispatch } from "react-redux";
import { updateLatestMessage } from "../store/latest-message-slice";

const Chart = () => {
  const [minutes, setMinutes] = useState(30);
  const { data, isLoading } = useGetLatestMessagesQuery(minutes);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) dispatch(updateLatestMessage(data));
  }, [data, dispatch, isLoading]);

  let pollingDateFormatted = {};
  if (!isLoading) {
    pollingDateFormatted = data.map((item) => ({
      ...item,
      time: formatTimeFunc(item.time),
    }));
  }

  const renderLineChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={pollingDateFormatted} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Tooltip />
        <Legend />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="energy" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="producedEnergy" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="power" stroke="#DC8B4B" dot={false} isAnimationActive={false} />

        <Line yAxisId="left" connectNulls type="monotone" dataKey="voltageX" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="currentX" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="powerX" stroke="#DC8B4B" dot={false} isAnimationActive={false} />

        <Line yAxisId="left" connectNulls type="monotone" dataKey="voltageY" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="currentY" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="powerY" stroke="#DC8B4B" dot={false} isAnimationActive={false} />

        <Line yAxisId="left" connectNulls type="monotone" dataKey="voltageZ" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="currentZ" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <Line yAxisId="left" connectNulls type="monotone" dataKey="powerZ" stroke="#DC8B4B" dot={false} isAnimationActive={false} />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <input type="text" onChange={(event) => setMinutes(event.target.value)} defaultValue={minutes} />
      {renderLineChart}
    </>
  );
};

export { Chart };

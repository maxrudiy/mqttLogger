import React, { useEffect, useMemo, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Chart = ({ data, skipFields }) => {
  const [reducedDataState, setReducedDataState] = useState();
  const [selectedKeys, setSelectedKeys] = useState({});

  const { reducedData, dataKeys } = useMemo(() => {
    const { reducedData, fields } = formatDataFunc(data, skipFields);
    const dataKeys = fields.filter((field) => field !== "time");
    return { reducedData, dataKeys };
  }, [data, skipFields]);

  useEffect(() => {
    if (dataKeys) setSelectedKeys(Object.fromEntries(dataKeys.map((dataKey) => [dataKey, true])));
  }, [dataKeys]);

  useEffect(() => {
    setReducedDataState(reducedData);
  }, [reducedData]);

  const toggleButtonHandler = (dataKey) => {
    setSelectedKeys({ ...selectedKeys, [dataKey]: !selectedKeys[dataKey] });
  };

  const renderLineChart = () => {
    return (
      <>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reducedDataState} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Tooltip />
            <Legend />
            {Object.keys(selectedKeys).map((dataKey, index) =>
              selectedKeys[dataKey] ? (
                <Line key={index} yAxisId="left" connectNulls type="monotone" dataKey={dataKey} stroke="#DC8B4B" dot={false} isAnimationActive={false} />
              ) : null
            )}
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
          </LineChart>
        </ResponsiveContainer>
        {dataKeys.map((dataKey, index) => (
          <button key={index} onClick={() => toggleButtonHandler(dataKey)}>
            {dataKey}
          </button>
        ))}
      </>
    );
  };

  return <>{reducedDataState ? renderLineChart() : "Loading"}</>;
};

const formatDataFunc = (data, skipFields) => {
  return data.reduce(
    ({ reducedData, fields }, obj) => {
      const o = Object.fromEntries(Object.entries(obj).filter(([field, value], index) => !skipFields.includes(field)));
      reducedData.push({ ...o, time: new Date(o.time) });

      for (const field of Object.keys(o)) {
        if (!fields.includes(field) && !skipFields.includes(field)) fields.push(field);
      }
      return { reducedData, fields };
    },
    { reducedData: [], fields: [] }
  );
};

export default Chart;

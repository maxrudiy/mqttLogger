import React from "react";
import { useGetMessagesQuery } from "../api/messages-api-slice";
import { toActivePower3ph, toApparentPower3ph } from "../functions";

const Messages = () => {
  const { data, isFetching, isLoading } = useGetMessagesQuery();

  return data ? (
    <div>
      powerTotal: {data.powerTotal} <br />
      powerA: {data.powerA}
      <br />
      powerB: {data.powerB}
      <br />
      powerDirectionA: {data.powerDirectionA}
      <br />
      powerDirectionB:{data.powerDirectionB}
      <br />
      powerFactorA: {data.powerFactorA}
      <br />
      powerFactorB: {data.powerFactorB}
      <br />
      powerFreq: {data.powerFreq}
      <br />
      voltage: {data.voltage}
      <br />
      currentA: {data.currentA}, 3phA apparent P={toApparentPower3ph(data.currentA, 380)}, active P={toActivePower3ph(data.currentA, 380, 0.79)}
      <br />
      currentB: {data.currentB}, 3phA apparent P={toApparentPower3ph(data.currentB, 380)}, active P={toActivePower3ph(data.currentB, 380, 0.79)}
      <br />
      forwardEnergyTotalA: {data.forwardEnergyTotalA}
      <br />
      reverseEnergyTotalA: {data.reverseEnergyTotalA}
      <br />
      forwardEnergyTotalB: {data.forwardEnergyTotalB}
      <br />
      reverseEnergyTotalB: {data.reverseEnergyTotalB}
      <br />
    </div>
  ) : (
    isLoading
  );
};

export { Messages };

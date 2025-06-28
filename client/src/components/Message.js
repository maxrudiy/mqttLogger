import React from "react";
import { useGetMessageQuery } from "../api/message-api-slice";

const Message = () => {
  const { data, isFetching, isLoading } = useGetMessageQuery();

  return data ? (
    <div>
      Модель Лічильника: {data.model}
      <br />
      Спожито електроенергії: {data.energy} кВт*год
      <br />
      Згенеровано електроенергії: {data.producedEnergy} кВт*год
      <br />
      Коефіцієнт потужності: {data.powerFactor}
      <br />
      Частота: {data.acFrequency} Гц
      <br />
      Напруга X:{data.voltageX} В
      <br />
      Струм X: {data.currentX} А
      <br />
      Потужність X: {data.powerX} Вт
      <br />
      Напруга Y: {data.voltageY} В
      <br />
      Струм Y: {data.currentY} А
      <br />
      Потужність Y: {data.powerY} Вт
      <br />
      Напруга Z: {data.voltageZ} В
      <br />
      Струм Z: {data.currentZ} А
      <br />
      Потужність Z: {data.powerZ} Вт
      <br />
      Загальна потужність: {data.power} Вт
      <br />
    </div>
  ) : (
    isLoading
  );
};

export { Message };

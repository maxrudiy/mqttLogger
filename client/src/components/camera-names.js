import { useGetCameraNamesQuery } from "../api/streams-api-slice";

const CameraNames = ({ setSelectedCamera }) => {
  const { data, isLoading, error } = useGetCameraNamesQuery();

  return (
    <>
      {!isLoading ? (
        data.map((cameraName, index) => (
          <button key={index} onClick={() => setSelectedCamera(cameraName)}>
            {cameraName}
          </button>
        ))
      ) : (
        <>isLoading</>
      )}
    </>
  );
};

export { CameraNames };

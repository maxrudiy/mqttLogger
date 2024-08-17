import { Route, Routes } from "react-router-dom";
import Layout from "./component/Layout";
import Pj1203aw from "./component/Pj1203aw";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Pj1203aw />} />
      </Route>
    </Routes>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;

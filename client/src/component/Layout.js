import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      Top
      <Outlet />
      Bottom
    </>
  );
};

export default Layout;

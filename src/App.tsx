import useNotification from "antd/es/notification/useNotification";
import "./App.css";
import { GNotifyContext } from "./app/hooks";
import { Outlet } from "react-router";
import AppLayout from "./app/layouts/AppLayout";

function App() {
  const [api, contextHolder] = useNotification();

  return (
    <GNotifyContext.Provider value={{ notify: api }}>
      <AppLayout>
        <Outlet />
      </AppLayout>
      {contextHolder}
    </GNotifyContext.Provider>
  );
}

export default App;

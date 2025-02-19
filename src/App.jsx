import { Outlet } from "react-router-dom";
import Header from "./components/header";
import "./styles/index.scss";

function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;

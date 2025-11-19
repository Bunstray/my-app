import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "/LoginPage.jsx";
import MainPage from "./MainPage";
import NotificationPage from "./NotificationPage";
import AcaraPage from "./AcaraPage";
import PeralatanPage from "./PeralatanPage";
import HasilPage from "./HasilPage";
import AcaraSayaPage from "./AcaraSayaPage";
import AccountPage from "./AccountPage";

function App() {
  const [count, setCount] = useState(0);

  return <LoginPage></LoginPage>;
}

export default App;

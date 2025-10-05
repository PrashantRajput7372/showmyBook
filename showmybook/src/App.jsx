// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import Screen from "./Components/Screen";
// import

import "./App.css";
import CinemaScreen from "./Components/CinemaScreen";

function App() {
  return (
    <>
      <div className="width-full h-screen bg-white text-black display-flex flex-col items-center justify-center">
        <CinemaScreen
          title={"Welcome To Imax"}
          subTitle={"Demoan Slayer Infinty Carsel"}
        />
      </div>
    </>
  );
}

export default App;

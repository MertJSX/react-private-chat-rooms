import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nopage from "./pages/Nopage";
import About from "./pages/about/About";
import Home from "./pages/home/Home"
import Room from "./pages/room/Room";
import "./global.scss"

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="room" element={<Room />} />
          <Route path="contact" element={<About />} />
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;

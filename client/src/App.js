import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nopage from "./pages/Nopage";
import About from "./pages/about/About";
import Join from "./pages/join/Join"
import Room from "./pages/room/Room";
import Kicked from "./pages/Kicked";
import "./global.scss"

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Join />} />
          <Route path="room" element={<Room />} />
          <Route path="contact" element={<About />} />
          <Route path="kicked" element={<Kicked />} />
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;

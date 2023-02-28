import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./join.scss";

const Join = () => {

  const [id, setId] = useState("")
  const navigate = useNavigate()
  
  return (
    <div className="join-container">
      <div className="content">
        <h1>Join Room</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          navigate(`/room?id=${id}`)
        }}>
          <input type="number" value={id} placeholder="ROOM ID"
          onChange={(e) => {
            setId(e.target.value);
          }}
           required />
          <button type="submit">JOIN</button>
        </form>
      </div>
    </div>
  );
};

export default Join;

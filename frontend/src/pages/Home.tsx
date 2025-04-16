import "../App.css";
import { useNavigate } from "react-router-dom";

type User = {
  email: string;
  role: string;
};

interface HomeProps {
  user: User | null;
}

const Home = ({ user }: HomeProps) => {
  const navigate = useNavigate();
  const handleMakeReservation = () => {
    if (!user) {
      alert("Please log in to make a reservation.");
      navigate("/login");
    } else {
      navigate("/reservations");
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>
          Welcome to <span className="highlight">ChainEats</span>
        </h1>
        <p>Discover and book the best restaurants around you.</p>
        {/* Animated Fancy Button */}
        <button onClick={handleMakeReservation} className="fancy-btn">
          Make a Reservation
          <div className="star-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              version="1.1"
              style={{
                shapeRendering: "geometricPrecision",
                textRendering: "geometricPrecision",
                imageRendering: "auto",
                fillRule: "evenodd",
                clipRule: "evenodd",
              }}
              viewBox="0 0 784.11 815.53"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              ></path>
            </svg>
          </div>
          <div className="star-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              version="1.1"
              style={{
                shapeRendering: "geometricPrecision",
                textRendering: "geometricPrecision",
                imageRendering: "auto",
                fillRule: "evenodd",
                clipRule: "evenodd",
              }}
              viewBox="0 0 784.11 815.53"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              ></path>
            </svg>
          </div>
          <div className="star-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              version="1.1"
              style={{
                shapeRendering: "geometricPrecision",
                textRendering: "geometricPrecision",
                imageRendering: "auto",
                fillRule: "evenodd",
                clipRule: "evenodd",
              }}
              viewBox="0 0 784.11 815.53"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              ></path>
            </svg>
          </div>
          <div className="star-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              version="1.1"
              style={{
                shapeRendering: "geometricPrecision",
                textRendering: "geometricPrecision",
                imageRendering: "auto",
                fillRule: "evenodd",
                clipRule: "evenodd",
              }}
              viewBox="0 0 784.11 815.53"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              ></path>
            </svg>
          </div>
          <div className="star-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              version="1.1"
              style={{
                shapeRendering: "geometricPrecision",
                textRendering: "geometricPrecision",
                imageRendering: "auto",
                fillRule: "evenodd",
                clipRule: "evenodd",
              }}
              viewBox="0 0 784.11 815.53"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              ></path>
            </svg>
          </div>
          <div className="star-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              version="1.1"
              style={{
                shapeRendering: "geometricPrecision",
                textRendering: "geometricPrecision",
                imageRendering: "auto",
                fillRule: "evenodd",
                clipRule: "evenodd",
              }}
              viewBox="0 0 784.11 815.53"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                className="fil0"
                d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              ></path>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;

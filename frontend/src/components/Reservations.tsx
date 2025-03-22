import { useState, useEffect } from "react";
import axios from "axios";

type Reservation = {
  _id: string;
  reservationDate: string;
  status: string;
  restaurant: {
    name: string;
  };
};

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:5000/reservations/my", {
        withCredentials: true,
      })
      .then((res) => setReservations(res.data))
      .catch((err) => console.error(err));
  }, []);

  const makeReservation = async () => {
    try {
      await axios.post(
        "http://localhost:5000/reservations",
        {
          restaurantId,
          date,
          time,
          guests,
        },
        { withCredentials: true }
      );
      alert("Reservation successful!");
    } catch (err: any) {
      alert("Reservation failed: " + err?.response?.data?.errors?.[0]?.msg);
    }
  };

  return (
    <div className="reservations-container">
      <h2>My Reservations</h2>
      <ul>
        {reservations.map((r) => (
          <li key={r._id}>
            {r.restaurant.name} -{" "}
            {new Date(r.reservationDate).toLocaleDateString()} ({r.status})
          </li>
        ))}
      </ul>

      <h3>Create a New Reservation</h3>
      <input
        type="text"
        placeholder="Restaurant ID"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Number of guests"
        min="1"
        value={guests}
        onChange={(e) => setGuests(parseInt(e.target.value))}
        required
      />
      <button onClick={makeReservation}>Reserve</button>
    </div>
  );
};

export default Reservations;

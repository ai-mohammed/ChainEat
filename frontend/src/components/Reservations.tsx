import { useState, useEffect } from "react";
import axios from "axios";

type Reservation = {
  _id: string;
  reservationDate: string;
  status: string;
  restaurant: { name: string };
  user: { email: string };
};

type Restaurant = {
  _id: string;
  name: string;
};

type User = {
  email: string;
  role: string;
};

type AxiosCustomError = {
  response?: {
    data?: {
      error?: string;
    };
  };
};

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [user, setUser] = useState<User | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data as User))
      .catch(() => setUser(null));

    axios
      .get(
        user?.role === "admin"
          ? "http://localhost:5000/reservations"
          : "http://localhost:5000/reservations/my",
        { withCredentials: true }
      )
      .then((res) => setReservations(res.data as Reservation[]))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/restaurants")
      .then((res) => setRestaurants(res.data as Restaurant[]))
      .catch((err) => console.error(err));
  }, [user]);

  const makeReservation = async () => {
    try {
      await axios.post(
        "http://localhost:5000/reservations",
        { restaurantName, date, time, guests },
        { withCredentials: true }
      );
      alert("Reservation successful!");
      window.location.reload();
    } catch (err: unknown) {
      const error = err as AxiosCustomError;
      alert(error.response?.data?.error || "Reservation failed");
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      const endpoint =
        user?.role === "admin"
          ? `http://localhost:5000/reservations/${id}`
          : `http://localhost:5000/reservations/my/${id}/cancel`;

      await axios.put(
        endpoint,
        { status: "cancelled" },
        { withCredentials: true }
      );
      alert("Reservation cancelled");
      window.location.reload();
    } catch (err: unknown) {
      const error = err as AxiosCustomError;
      alert(error.response?.data?.error || "Cancellation failed");
    }
  };

  const confirmReservation = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/reservations/${id}`,
        { status: "confirmed" },
        { withCredentials: true }
      );
      alert("Reservation confirmed");
      window.location.reload();
    } catch (err: unknown) {
      const error = err as AxiosCustomError;
      alert(error.response?.data?.error || "Confirmation failed");
    }
  };

  return (
    <div className="reservations-container">
      <h2>{user?.role === "admin" ? "All Reservations" : "My Reservations"}</h2>
      <ul>
        {reservations.map((r) => (
          <li key={r._id}>
            {r.restaurant.name} - {new Date(r.reservationDate).toLocaleString()}{" "}
            ({r.status}){user?.role === "admin" && <> by {r.user.email}</>}
            {r.status === "pending" && user?.role === "admin" && (
              <>
                <button onClick={() => confirmReservation(r._id)}>
                  Confirm
                </button>
                <button onClick={() => cancelReservation(r._id)}>Cancel</button>
              </>
            )}
            {r.status === "pending" && user?.role !== "admin" && (
              <button onClick={() => cancelReservation(r._id)}>Cancel</button>
            )}
          </li>
        ))}
      </ul>

      {user?.role !== "admin" && (
        <>
          <h3>Create Reservation</h3>

          <select
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a Restaurant
            </option>
            {restaurants.map((res) => (
              <option key={res._id} value={res.name}>
                {res.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            required
          />

          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={!date}
          >
            <option value="" disabled>
              Select Time
            </option>
            {generateAvailableTimes(date)}
          </select>

          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            required
          />
          <button onClick={makeReservation}>Reserve</button>
        </>
      )}
    </div>
  );
};

// Dynamic available time slots function clearly defined:
const generateAvailableTimes = (date: string) => {
  const times = [] as React.ReactElement[];
  if (!date) return times;

  const selectedDate = new Date(date);
  const now = new Date();

  for (let hour = 11; hour <= 23; hour++) {
    ["00", "30"].forEach((minute) => {
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute}`;
      const slotDateTime = new Date(`${date}T${timeStr}`);
      if (
        selectedDate.toDateString() !== now.toDateString() ||
        slotDateTime > now
      )
        times.push(<option key={timeStr}>{timeStr}</option>);
    });
  }

  const midnight = new Date(`${date}T00:00`);
  midnight.setDate(midnight.getDate() + 1);
  if (selectedDate.toDateString() !== now.toDateString() || midnight > now)
    times.push(<option key="00:00">00:00</option>);

  return times;
};

export default Reservations;

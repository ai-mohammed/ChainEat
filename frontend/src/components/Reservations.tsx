import axios from "axios";
import React, { useState, useEffect, ReactElement } from "react";
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

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [user, setUser] = useState<User | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // 1) Load session user + restaurant list once
  useEffect(() => {
    axios
      .get("/auth/me")
      .then((res) => setUser(res.data as User))
      .catch(() => setUser(null));

    axios
      .get("/restaurants")
      .then((res) => setRestaurants(res.data as Restaurant[]))
      .catch(console.error);
  }, []);

  // 2) Fetch reservation list (admin vs customer)
  const fetchReservations = useCallback(() => {
    if (!user) return;
    const url = user.role === "admin" ? "/reservations" : "/reservations/my";
    axios
      .get(url)
      .then((res) => setReservations(res.data as Reservation[]))
      .catch(console.error);
  }, [user]);

  // 3) Re‑fetch whenever `user` changes
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 4) Actions now simply re‑fetch
  const makeReservation = async () => {
    try {
      await axios.post("/reservations", { restaurantName, date, time, guests });
      alert("Reservation successful!");
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.error || "Reservation failed");
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      const endpoint =
        user?.role === "admin"
          ? `/reservations/${id}`
          : `/reservations/my/${id}/cancel`;
      await axios.put(endpoint, { status: "cancelled" });
      alert("Reservation cancelled");
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.error || "Cancellation failed");
    }
  };

  const confirmReservation = async (id: string) => {
    try {
      await axios.put(`/reservations/${id}`, { status: "confirmed" });
      alert("Reservation confirmed");
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.error || "Confirmation failed");
    }
  };

  return (
    <div className="reservation-form">
      <div className="reservation-wrapper">
        <h2 className="reservation-title">
          {user?.role === "admin" ? "All Reservations" : "My Reservations"}
        </h2>
        <div className="reservation-card-list">
          {reservations.map((r) => (
            <div className="reservation-card" key={r._id}>
              <div>
                <h3 className="restaurant-name">{r.restaurant.name}</h3>
                <p className="reservation-date">
                  {new Date(r.reservationDate).toLocaleString()}
                </p>
                <p className="reservation-status">Status: {r.status}</p>
                {user?.role === "admin" && (
                  <p className="reservation-user">User: {r.user.email}</p>
                )}
              </div>
              <div className="reservation-buttons">
                {r.status === "pending" && user?.role === "admin" && (
                  <>
                    <button
                      className="btn confirm"
                      onClick={() => confirmReservation(r._id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn cancel"
                      onClick={() => cancelReservation(r._id)}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {r.status === "pending" && user?.role !== "admin" && (
                  <button
                    className="btn cancel"
                    onClick={() => cancelReservation(r._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {user?.role !== "admin" && (
        <div className="reservation-form">
          <h3 className="form-title">Create Reservation</h3>
          <label>
            Restaurant
            <select
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a Restaurant
              </option>
              {restaurants.map((r) => (
                <option key={r._id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
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
          </label>

          <label>
            Time
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
          </label>

          <label>
            Guests
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
            />
          </label>

          <button className="btn reserve" onClick={makeReservation}>
            Reserve
          </button>
        </div>
      )}
    </div>
  );
};

// Your existing generateAvailableTimes helper
const generateAvailableTimes = (date: string): ReactElement[] => {
  const times: ReactElement[] = [];
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
        times.push((<option key={timeStr}>{timeStr}</option>) as ReactElement);
    });
  }

  const midnight = new Date(`${date}T00:00`);
  midnight.setDate(midnight.getDate() + 1);
  if (selectedDate.toDateString() !== now.toDateString() || midnight > now)
    times.push((<option key="00:00">00:00</option>) as ReactElement);

  return times;
};

export default Reservations;

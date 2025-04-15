// frontend/src/pages/Restaurants.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import AddRestaurant from "../components/AddRestaurant";

/** ------------------ TYPES ------------------ **/

/**
 * Represents a single Restaurant item from the backend.
 * rating/ratingCount are optional if our database
 * doesn't store them or they're not yet calculated.
 */
type Restaurant = {
  _id: string;
  name: string;
  address: string;
  cuisine: string;
  description?: string;
  rating?: number;
  ratingCount?: number;
};

/**
 * Represents the currently logged-in user,
 * for checking admin privileges, etc.
 */
type User = {
  email: string;
  role: string;
};

/** ---------------- MAIN COMPONENT ---------------- **/

function Restaurants() {
  /**
   * State variables
   * ------------------------------------------------
   * restaurants: Full array of Restaurant items from API
   * user: Logged-in user data (or null if no session)
   * showEditModal: Whether the "edit restaurant" modal is open
   * editingRestaurant: The restaurant being edited (if any)
   */
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );

  /**
   * editData: Local state for the "edit restaurant" form,
   * containing name, address, cuisine, description.
   */
  const [editData, setEditData] = useState({
    name: "",
    address: "",
    cuisine: "",
    description: "",
  });

  /**
   * Search & Filter
   * ------------------------------------------------
   * searchQuery: filters restaurants by partial match on name or cuisine
   * sortKey: indicates which property to sort by (e.g., 'name', 'rating')
   * sortOrder: 'asc' or 'desc'
   */
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "rating" | "none">("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /**
   * expandedRestaurantIds: a list of IDs for restaurants
   * whose "detailed view" is expanded. This allows toggling
   * additional info (like a menu or big description).
   */
  const [expandedRestaurantIds, setExpandedRestaurantIds] = useState<string[]>(
    []
  );

  /**
   * favoriteIds: a list of IDs that the user has "favorited".
   * For demonstration, we store it in local state (not the server).
   * In a real app, we'd likely store favorites on the server or in user profile.
   */
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  /**
   * On mount: fetch restaurants and user info.
   */
  useEffect(() => {
    // 1) Fetch the restaurants
    axios
      .get("http://localhost:5000/restaurants")
      .then((res) => setRestaurants(res.data as Restaurant[]))
      .catch((err) => console.error("Failed to load restaurants:", err));

    // 2) Fetch the logged-in user
    axios
      .get<User>("http://localhost:5000/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  /**
   * handleEdit: Opens the modal, storing the restaurant
   * we plan to edit, along with its existing data in editData.
   */
  const handleEdit = (rest: Restaurant) => {
    setEditingRestaurant(rest);
    setEditData({
      name: rest.name,
      address: rest.address,
      cuisine: rest.cuisine,
      description: rest.description || "",
    });
    setShowEditModal(true);
  };

  /**
   * handleUpdate: Submits new data to the server (PUT),
   * updates local state, and closes the modal.
   */
  const handleUpdate = async () => {
    if (!editingRestaurant) return;
    try {
      await axios.put(
        `http://localhost:5000/restaurants/${editingRestaurant._id}`,
        editData,
        { withCredentials: true }
      );
      // Reflect changes in local state
      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === editingRestaurant._id ? { ...r, ...editData } : r
        )
      );
      setShowEditModal(false);
      alert("Restaurant updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed");
    }
  };

  /**
   * handleDelete: confirm, then call DELETE on the server,
   * removing the item from local state if successful.
   */
  const handleDelete = async (restaurantId: string) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/restaurants/${restaurantId}`, {
        withCredentials: true,
      });
      setRestaurants((prev) => prev.filter((r) => r._id !== restaurantId));
      alert("Deleted successfully!");
    } catch (err) {
      console.error("Deletion error:", err);
      alert("Deletion failed");
    }
  };

  /**
   * toggleExpand: toggles whether a restaurant's ID is in expandedRestaurantIds,
   * thus showing or hiding additional details.
   */
  const toggleExpand = (restaurantId: string) => {
    setExpandedRestaurantIds((prev) => {
      if (prev.includes(restaurantId)) {
        // Remove from array to collapse
        return prev.filter((id) => id !== restaurantId);
      } else {
        // Add to array to expand
        return [...prev, restaurantId];
      }
    });
  };

  /**
   * toggleFavorite: toggles the given restaurant as a favorite.
   * In a real app, we'd likely store this in the DB for the user.
   */
  const toggleFavorite = (restaurantId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(restaurantId)) {
        // remove it
        return prev.filter((id) => id !== restaurantId);
      } else {
        // add it
        return [...prev, restaurantId];
      }
    });
  };

  /** ------------- RATING COMPONENT ------------- **/

  /**
   * StarRating subcomponent for animated star-based rating.
   * We may adjust the POST route or star color scheme as needed.
   */
  function StarRating({ restaurant }: { restaurant: Restaurant }) {
    const [localRating, setLocalRating] = useState<number>(0);
    const [hoveredStar, setHoveredStar] = useState<number>(0);

    const handleStarClick = async (value: number) => {
      setLocalRating(value);
      // Example route: POST /restaurants/:id/rate
      try {
        await axios.post(
          `http://localhost:5000/restaurants/${restaurant._id}/rate`,
          { userRating: value },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Rating failed:", err);
        alert("Rating submission failed");
      }
    };

    // Generate a 5-star row
    const starElements = Array.from({ length: 5 }, (_, i) => {
      const starIndex = i + 1;
      const isFilled = starIndex <= (hoveredStar || localRating);

      return (
        <span
          key={starIndex}
          style={{
            cursor: "pointer",
            fontSize: "1.4rem",
            marginRight: "3px",
            color: isFilled ? "#ffcc00" : "#ccc",
            transition: "color 0.2s",
          }}
          onClick={() => handleStarClick(starIndex)}
          onMouseEnter={() => setHoveredStar(starIndex)}
          onMouseLeave={() => setHoveredStar(0)}
        >
          ★
        </span>
      );
    });

    // Show the local rating or the restaurant's rating data
    let ratingText = "No rating yet";
    if (localRating > 0) {
      ratingText = `You rated: ${localRating}/5`;
    } else if (restaurant.rating && restaurant.ratingCount) {
      ratingText = `Avg: ${restaurant.rating.toFixed(1)}/5 (${
        restaurant.ratingCount
      })`;
    }

    return (
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {starElements}
        <span style={{ fontSize: "0.9rem", color: "#666" }}>{ratingText}</span>
      </div>
    );
  }

  /** ------------- SEARCH & SORTING LOGIC ------------- **/

  /**
   * sortRestaurants: returns a new array with sorted restaurants
   * based on sortKey + sortOrder.
   */
  const sortRestaurants = (arr: Restaurant[]): Restaurant[] => {
    if (sortKey === "none") return arr; // no sorting
    return [...arr].sort((a, b) => {
      const valA = sortKey === "name" ? a.name : a.rating || 0;
      const valB = sortKey === "name" ? b.name : b.rating || 0;

      if (sortOrder === "asc") {
        // ascending
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      } else {
        // descending
        if (valA > valB) return -1;
        if (valA < valB) return 1;
        return 0;
      }
    });
  };

  /**
   * filterRestaurants: returns only those whose name/cuisine
   * matches searchQuery (case-insensitive).
   */
  const filterRestaurants = (): Restaurant[] => {
    const filtered = restaurants.filter((r) => {
      const text = (r.name + r.cuisine).toLowerCase();
      return text.includes(searchQuery.toLowerCase());
    });
    // then sort them
    return sortRestaurants(filtered);
  };

  // We'll apply filter logic
  const displayedRestaurants = filterRestaurants();

  /** ------------- RENDER ------------- **/

  return (
    <div style={{ width: "100%", padding: "80px 20px" }}>
      {/* -- PAGE TITLE -- */}
      <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#333" }}>
        Advanced Restaurants List
      </h1>

      {/* -- SEARCH & SORT CONTROLS -- */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        {/* Search box */}
        <input
          type="text"
          placeholder="Search name/cuisine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {/* Sorting by name/rating */}
        <select
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          value={sortKey}
          onChange={(e) =>
            setSortKey(e.target.value as "none" | "name" | "rating")
          }
        >
          <option value="none">Sort: None</option>
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>

        {/* Asc/Desc toggler */}
        <select
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* -- ADMIN: CREATE NEW RESTAURANT -- */}
      {user?.role === "admin" && (
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto 50px auto",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "20px",
          }}
        >
          <AddRestaurant />
        </div>
      )}

      {/* -- RESTAURANTS GRID -- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {displayedRestaurants.map((restaurant) => {
          // Check if this restaurant is expanded or favorited
          const isExpanded = expandedRestaurantIds.includes(restaurant._id);
          const isFavorited = favoriteIds.includes(restaurant._id);

          return (
            <div
              key={restaurant._id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget as HTMLDivElement;
                card.style.transform = "translateY(-4px)";
                card.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget as HTMLDivElement;
                card.style.transform = "";
                card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ padding: "16px" }}>
                {/* NAME + FAVORITE BUTTON */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2 style={{ margin: "0 0 8px", color: "#ff6600" }}>
                    {restaurant.name}
                  </h2>
                  <button
                    style={{
                      backgroundColor: isFavorited ? "#f44336" : "#ccc",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      // we need to stop event from toggling the card hover
                      e.stopPropagation();
                      toggleFavorite(restaurant._id);
                    }}
                  >
                    {isFavorited ? "★ Fav" : "☆ Fav"}
                  </button>
                </div>

                <p style={{ margin: "4px 0", color: "#555" }}>
                  <strong>Cuisine: </strong>
                  {restaurant.cuisine}
                </p>

                {/* Minimal address */}
                <p style={{ margin: "4px 0", color: "#555" }}>
                  <em>{restaurant.address}</em>
                </p>

                {/* StarRating subcomponent */}
                <StarRating restaurant={restaurant} />

                {/* Expand button to see more details (like description) */}
                <div style={{ marginTop: "8px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(restaurant._id);
                    }}
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {/* If expanded, show the full description or extra info */}
                {isExpanded && (
                  <div style={{ marginTop: "10px", color: "#444" }}>
                    {restaurant.description ? (
                      <p style={{ whiteSpace: "pre-wrap" }}>
                        {restaurant.description}
                      </p>
                    ) : (
                      <p>No detailed description available.</p>
                    )}
                    {/* Additional info could go here, like a menu listing */}
                  </div>
                )}

                {/* If user is admin, show Edit/Delete buttons */}
                {user?.role === "admin" && (
                  <div
                    style={{ marginTop: "10px", display: "flex", gap: "8px" }}
                  >
                    <button onClick={() => handleEdit(restaurant)}>Edit</button>
                    <button onClick={() => handleDelete(restaurant._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* -------------- EDIT MODAL -------------- */}
      {showEditModal && editingRestaurant && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Edit Restaurant</h3>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
            />
            <input
              type="text"
              value={editData.address}
              onChange={(e) =>
                setEditData({ ...editData, address: e.target.value })
              }
              placeholder="Address"
            />
            <input
              type="text"
              value={editData.cuisine}
              onChange={(e) =>
                setEditData({ ...editData, cuisine: e.target.value })
              }
              placeholder="Cuisine"
            />
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              placeholder="Description"
              style={{
                resize: "vertical",
                minHeight: "60px",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Restaurants;

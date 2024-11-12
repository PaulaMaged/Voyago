import { useState, useEffect } from "react";
import currencyConversions from "../helpers/currencyConversions";
import axios from "axios";

function ItineraryComponent() {
  const [result, setResult] = useState("");
  const [itineraries, setItineraries] = useState([]);
  const [filter, setFilter] = useState({
    budget: "",
    date: "",
    preferences: [],
    language: "",
  });
  const [sortCriteria, setSortCriteria] = useState("price"); // or "rating"

  // Fetch itineraries initially or when the component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/seller/itineraries"
        );
        setItineraries(response.data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, []);

  // Filter itineraries based on the criteria
  const filterItineraries = () => {
    return itineraries.filter((itinerary) => {
      const withinBudget =
        !filter.budget ||
        currencyConversions.convertFromDB(itinerary.price) <=
          parseFloat(filter.budget);
      const matchesDate =
        !filter.date ||
        itinerary.available_dates.some(
          (date) =>
            new Date(date).toDateString() ===
            new Date(filter.date).toDateString()
        );
      const matchesLanguage =
        !filter.language ||
        itinerary.language
          .toLowerCase()
          .includes(filter.language.toLowerCase());
      const matchesPreference =
        !filter.preferences.length ||
        filter.preferences.some((pref) =>
          itinerary.preference?.toLowerCase().includes(pref.toLowerCase())
        ); // Assuming each itinerary has a 'preference' field

      return (
        withinBudget && matchesDate && matchesLanguage && matchesPreference
      );
    });
  };

  // Sort itineraries based on selected criteria
  const sortedItineraries = filterItineraries().sort((a, b) => {
    if (sortCriteria === "price") {
      return a.price - b.price;
    }
    if (sortCriteria === "rating") {
      return b.rating - a.rating; // Assuming there is a 'rating' field
    }
    return 0;
  });

  const createItinerary = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      tour_guide: formData.get("tour_guide"),
      name: formData.get("name"),
      description: formData.get("description"),
      language: formData.get("language"),
      price: currencyConversions.convertToDB(parseFloat(formData.get("price"))),
      activities: formData
        .get("activities")
        .split(",")
        .map((id) => id.trim()),
      available_dates: formData
        .get("available_dates")
        .split(",")
        .map((date) => new Date(date.trim())),
      available_times: formData
        .get("available_times")
        .split(",")
        .map((time) => time.trim()),
      accessibility: formData.get("accessibility") === "on",
      pick_up: formData.get("pick_up"),
      drop_off: formData.get("drop_off"),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/seller/itineraries",
        data
      );
      setResult(JSON.stringify(response.data, null, 2));
      // Refresh itineraries after creation
      const newItineraries = await axios.get(
        "http://localhost:8000/api/seller/itineraries"
      );
      setItineraries(newItineraries.data);
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const getItinerary = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/seller/itineraries/${id}`
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const deleteItinerary = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/seller/itineraries/${id}`
      );
      setResult(JSON.stringify(response.data, null, 2));
      // Refresh itineraries after deletion
      const newItineraries = await axios.get(
        "http://localhost:5000/api/seller/itineraries"
      );
      setItineraries(newItineraries.data);
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Itinerary Management</h1>

      {/* Create Itinerary Form */}
      <div style={styles.formContainer}>
        <h2 style={styles.subtitle}>Create Itinerary</h2>
        <form onSubmit={createItinerary} style={styles.form}>
          <label style={styles.label}>
            Tour Guide ID:
            <input
              type="text"
              name="tour_guide"
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Name:
            <input type="text" name="name" required style={styles.input} />
          </label>
          <label style={styles.label}>
            Description:
            <textarea name="description" style={styles.textarea} />
          </label>
          <label style={styles.label}>
            Language:
            <input type="text" name="language" style={styles.input} />
          </label>
          <label style={styles.label}>
            Price:
            <input
              type="number"
              step="0.01"
              name="price"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Activities (comma-separated IDs):
            <input type="text" name="activities" style={styles.input} />
          </label>
          <label style={styles.label}>
            Available Dates (comma-separated, YYYY-MM-DD):
            <input type="text" name="available_dates" style={styles.input} />
          </label>
          <label style={styles.label}>
            Available Times (comma-separated, HH:MM):
            <input type="text" name="available_times" style={styles.input} />
          </label>
          <label style={styles.checkboxLabel}>
            Accessibility:
            <input
              type="checkbox"
              name="accessibility"
              style={styles.checkbox}
            />
          </label>
          <label style={styles.label}>
            Pick-up Location ID:
            <input type="text" name="pick_up" style={styles.input} />
          </label>
          <label style={styles.label}>
            Drop-off Location ID:
            <input type="text" name="drop_off" style={styles.input} />
          </label>
          <button type="submit" style={styles.button}>
            Create Itinerary
          </button>
        </form>
      </div>

      {/* Get and Delete Itinerary Forms */}
      <div style={styles.formContainer}>
        <h2 style={styles.subtitle}>Get Itinerary</h2>
        <form onSubmit={getItinerary} style={styles.form}>
          <label style={styles.label}>
            Itinerary ID:
            <input type="text" name="id" required style={styles.input} />
          </label>
          <button type="submit" style={styles.button}>
            Get Itinerary
          </button>
        </form>
      </div>

      <div style={styles.formContainer}>
        <h2 style={styles.subtitle}>Delete Itinerary</h2>
        <form onSubmit={deleteItinerary} style={styles.form}>
          <label style={styles.label}>
            Itinerary ID:
            <input type="text" name="id" required style={styles.input} />
          </label>
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: "#e74c3c" }}
          >
            Delete Itinerary
          </button>
        </form>
      </div>

      {/* Filtering and Sorting */}
      <div style={styles.filterContainer}>
        <h2 style={styles.subtitle}>Filter Itineraries</h2>
        <form style={styles.form}>
          <label style={styles.label}>
            Budget:
            <input
              type="number"
              value={filter.budget}
              onChange={(e) => setFilter({ ...filter, budget: e.target.value })}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Date:
            <input
              type="date"
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Language:
            <input
              type="text"
              value={filter.language}
              onChange={(e) =>
                setFilter({ ...filter, language: e.target.value })
              }
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Preferences (comma-separated):
            <input
              type="text"
              value={filter.preferences.join(",")}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  preferences: e.target.value
                    .split(",")
                    .map((pref) => pref.trim()),
                })
              }
              style={styles.input}
            />
          </label>
          <button
            type="button"
            onClick={() =>
              setFilter({ budget: "", date: "", preferences: [], language: "" })
            }
            style={styles.button}
          >
            Clear Filters
          </button>
        </form>

        <h2 style={styles.subtitle}>Sort Itineraries</h2>
        <label style={styles.label}>
          Sort by:
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            style={styles.select}
          >
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>

      {/* Display the filtered and sorted itineraries */}
      <h2 style={styles.subtitle}>Upcoming Itineraries</h2>
      <div style={styles.itineraryContainer}>
        {sortedItineraries.length > 0 ? (
          sortedItineraries.map((itinerary) => (
            <div key={itinerary._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{itinerary.name}</h3>
              <p style={styles.cardDescription}>{itinerary.description}</p>
              <p>
                <strong>Language:</strong> {itinerary.language}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {currencyConversions.convertFromDB(activity.price).toFixed(2) +
                  " " +
                  localStorage.getItem("currency")}
              </p>
              <p>
                <strong>Available Dates:</strong>{" "}
                {itinerary.available_dates
                  .map((date) => new Date(date).toLocaleDateString())
                  .join(", ")}
              </p>
              <p>
                <strong>Available Times:</strong>{" "}
                {itinerary.available_times.join(", ")}
              </p>
              <p>
                <strong>Accessibility:</strong>{" "}
                {itinerary.accessibility ? "Yes" : "No"}
              </p>
              <p>
                <strong>Pick-up:</strong> {itinerary.pick_up}
              </p>
              <p>
                <strong>Drop-off:</strong> {itinerary.drop_off}
              </p>
              <p>
                <strong>Activities:</strong> {itinerary.activities.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p>No itineraries found.</p>
        )}
      </div>

      {/* Display the result */}
      <h2 style={styles.subtitle}>Response:</h2>
      <pre style={styles.response}>{result}</pre>
    </div>
  );
}

export default ItineraryComponent;

// Styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitle: {
    color: "#2c3e50",
    borderBottom: "2px solid #bdc3c7",
    paddingBottom: "5px",
  },
  formContainer: {
    backgroundColor: "#ecf0f1",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #bdc3c7",
  },
  textarea: {
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #bdc3c7",
    height: "80px",
  },
  checkbox: {
    marginLeft: "10px",
  },
  button: {
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  select: {
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #bdc3c7",
  },
  filterContainer: {
    backgroundColor: "#ecf0f1",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
  },
  itineraryContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    flex: "1 1 calc(33% - 20px)",
    boxSizing: "border-box",
  },
  cardTitle: {
    marginTop: "0",
    color: "#2980b9",
  },
  cardDescription: {
    fontStyle: "italic",
  },
  response: {
    backgroundColor: "#ecf0f1",
    padding: "15px",
    borderRadius: "8px",
    overflowX: "auto",
  },
};

import "./Login.css";
import axios from "axios";

const handleSubmit = (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  login(username, password);
};

const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:8000/api/user/login", {
      email,
      password,
    });

    if (response.status === 200 || response.status === 201) {
      // Destructure the response data
      const { token, user, ...roleData } = response.data;

      // List of possible roles
      const roleNames = [
        "ADMIN",
        "USER",
        "TOURIST",
        "TOUR_GUIDE",
        "TOUR_GOVERNOR",
        "SELLER",
        "ADVERTISER",
      ];

      let roleId = null;
      let roleName = null;

      // Find the role present in the response
      for (const role of roleNames) {
        const roleKey = role.toLowerCase();
        if (roleData[roleKey]) {
          roleId = roleData[roleKey]._id;
          roleName = role;
          console.log(`Role found: ${roleName}, ID: ${roleId}`);
          break;
        }
      }

      // Store token, user, and role ID in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (roleId) {
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("roleName", roleName);
      }

      alert("Login successful");
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error(error);
  }
};

function Login() {
  return (
    <div className="login">
      <form className="Login_form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" required />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

import "./Login.css";
import axios from "axios";

const handleSubmit = (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  login(username, password);
};

const login = async (username, password) => {
  try {
    const response = await axios.post("http://localhost:5000/login", {
      username,
      password,
    });
    if (response.status === 200 || response.status === 201) {
      alert("login success");
    } else throw new Error("login failed");
  } catch (error) {
    console.log(error);
  }
};

function Login() {
  return (
    <div className="login">
      <form className="Login_form" onSubmit={handleSubmit}>
        <label htmlFor="username">username:</label>
        <input type="text" id="username" required></input>
        <label htmlFor="password">password:</label>
        <input type="password" id="password" required></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

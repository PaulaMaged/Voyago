import { useState } from "react";


function LoginAlt() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  /**
   * It is responsible for sending data 
   * to the backend and recieve the response,
   * then it should do action besed on the responese
   */
  const handleSubmit = () => {
    
  }
  return(
    <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          required/>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          required/>
          <br />
          <br />
          <input type="file" />
        </form>
    </div>
  )
}

export default LoginAlt; 
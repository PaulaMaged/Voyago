import jwt from "jsonwebtoken";


const authorize = (roles) => {
    return async (req, res, next) => {
      try {
        // Get the token from the request headers
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, secretKey);
        // Get the user's role from the decoded token
        const userRole = decodedToken.role;
        // Check if the user's role is included in the allowed roles
        if (roles.includes(userRole)) {
          // If the user's role is allowed, proceed to the next middleware
          next();
        } else {
          // If the user's role is not allowed, return a 403 error response
          return res.status(403).json({ message: "Access denied" });
        }
      } catch (error) {
        // If there is an error verifying the token, return a 401 error response
        return res.status(401).json({ message: "Invalid token" });
      }
    };
};

export default authorize;



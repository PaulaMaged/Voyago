
// Import the jwt library
import jwt from 'jsonwebtoken';

// Set the maximum age of the JWT to 1 hour (in seconds)
const maxAge = 60 * 60;

// Define a secret key for signing the JWT
const secretKey = 'supersecret';

/**
 * Creates a new JSON Web Token (JWT) with the provided user data.
 *
 * @param {Object} userData - User data to be included in the JWT.
 * @param {string} userData.name - Username.
 * @param {string} userData.role - User's role.
 *
 * @returns {string} A new JWT signed with the secret key and set to expire in maxAge seconds.
 */
const createToken = (userData) => {
// Use the jwt.sign() method to create a new JWT with the provided user data
  return jwt.sign(userData, secretKey, {
    expiresIn: maxAge
  });
};

export default createToken;

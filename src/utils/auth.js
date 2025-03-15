import jwt from "jsonwebtoken";

/**
 * Creates a JWT token for the user
 * @param {string} userId - The user's ID
 * @param {string} role - The user's role (COACH or ATHLETE)
 * @param {number} expiresIn - Token expiration time in seconds (default: 1 day)
 * @returns {string} JWT token
 */
export function createToken(userId, role, expiresIn = 86400) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      _id: userId,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
}

/**
 * Verifies a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
}

/**
 * Decodes a JWT token without verification
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

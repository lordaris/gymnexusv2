/**
 * Creates a refresh token for the user
 * @param {string} userId - The user's ID
 * @returns {string} JWT refresh token
 */
export function createRefreshToken(userId) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables"
    );
  }

  return jwt.sign(
    { _id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Refresh tokens last longer
  );
}

/**
 * Verifies a refresh token
 * @param {string} token - The refresh token to verify
 * @returns {Object} Decoded token payload
 */
export function verifyRefreshToken(token) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables"
    );
  }

  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw error;
  }
}

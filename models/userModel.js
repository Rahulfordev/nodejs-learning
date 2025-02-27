const pool = require("../db");
const bcrypt = require("bcryptjs");

const UserModel = {
  // Find a user by email
  async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  // Create a new user
  async createUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    return result.rows[0]; // Return the newly created user
  },

  // Find a user by reset token
  async findByResetToken(token) {
    const result = await pool.query(
      "SELECT * FROM users WHERE reset_token IS NOT NULL"
    );
    const user = result.rows.find((u) =>
      bcrypt.compareSync(token, u.reset_token)
    );
    return user;
  },

  // Store a reset token in the database
  async saveResetToken(email, tokenHash, expiresAt) {
    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3",
      [tokenHash, expiresAt, email]
    );
  },

  // Reset user password
  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [hashedPassword, userId]
    );
  },
  async saveVerificationToken(email, token) {
    await pool.query(
      "UPDATE users SET verification_token = $1 WHERE email = $2",
      [token, email]
    );
  },

  // Verify user account
  async verifyUser(token) {
    const result = await pool.query(
      "SELECT * FROM users WHERE verification_token IS NOT NULL"
    );
    const user = result.rows.find((u) =>
      bcrypt.compareSync(token, u.verification_token)
    );

    if (!user) return null;

    await pool.query(
      "UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1",
      [user.id]
    );

    return user;
  },

  // Check if user is verified
  async isUserVerified(email) {
    const result = await pool.query(
      "SELECT is_verified FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0]?.is_verified || false;
  },
};

module.exports = UserModel;

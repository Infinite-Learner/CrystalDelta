const bcrypt = require("bcrypt");
const db = require("../config/db");
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }
  db.query(
    "SELECT * FROM drcart_users WHERE user_email = ? and user_Name = ?",
    [email,username],
    async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "UserName or Email is already taken." });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query =
          "INSERT INTO drcart_users (user_name,user_email, login_password,logged_time) VALUES (?,?, ?,NOW())";
        db.query(query, [username, email, hashedPassword], (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            return res
              .status(500)
              .json({ success: false, message: "Failed to create user" });
          }
          res
            .status(201)
            .json({ success: true, message: "User registered successfully" });
        });
      } catch (error) {
        console.error("Error during password hashing:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }
  );
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }
  db.query(
    "SELECT * FROM drcart_users WHERE user_email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      const user = results[0];
      bcrypt.compare(password, user.login_password, (err, match) => {
        if (err || !match) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid email or password" });
        }
        req.session.username = user.User_Name;
        req.session.userid = user.User_Id;
        req.session.useremail = user.User_Email;
        db.query("UPDATE drcart_users SET logged_time = NOW() WHERE user_id = ?",[user.User_Id],(err)=>{
          if (err) throw err;
        });
        res.json({ success: true,message: "Login successful ",username:user.User_Name});
      });
    }
  );
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
};

module.exports = { signup, login,logout };

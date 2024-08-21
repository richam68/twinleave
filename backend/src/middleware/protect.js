const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    console.log("decode", decoded);
    console.log("req.user", req.user, decoded.id);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = auth;

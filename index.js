const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // CORS 추가
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // 모든 출처 허용
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello, Node.js Backend!");
});

// 사용자 라우트
const userRoutes = require("./routers/users");
app.use("/api", userRoutes); 

const authRoutes = require("./routers/auth");
app.use("/api", authRoutes);

const guardianRoutes = require("./routers/guardian");
app.use("/api", guardianRoutes);

const gardlistRoutes = require("./routers/gardlist");
app.use("/api", gardlistRoutes);

const medicationsRoutes = require("./routers/medications");
app.use("/api", medicationsRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

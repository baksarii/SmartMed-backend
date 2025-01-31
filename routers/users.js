const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/signup", async (req, res) => {
  console.log("요청 데이터: ", req.body); // 요청 데이터 로그 확인

  const { user_id, name, email, passwd } = req.body;

  if (!user_id || !name || !email || !passwd) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO users (user_id, name, email, passwd) VALUES (?, ?, ?, ?)",
      [user_id, name, email, passwd]
    );
    res.status(201).json({ message: "회원가입 성공", userId: result.insertId });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// DB 연결 테스트 라우트
router.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.status(200).json({ result: rows[0].result });
  } catch (error) {
    console.error("DB 연결 오류:", error);
    res.status(500).json({ error: "DB 연결 실패" });
  }
});

module.exports = router;

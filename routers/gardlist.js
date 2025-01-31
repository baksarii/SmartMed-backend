const express = require("express");
const router = express.Router();
const pool = require("../db"); // DB 연결 파일

router.get("/guardians", async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    console.log("요청 헤더에서 받은 userId:", userId); // 디버깅용 로그
    if (!userId) {
      return res
        .status(400)
        .json({ error: "사용자 ID가 제공되지 않았습니다." });
    }

    const query = `
      SELECT g.guardian_id, g.name 
      FROM user_guardians ug
      JOIN guardians g ON ug.guardian_id = g.guardian_id
      WHERE ug.user_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    console.log("조회된 보호자 목록:", rows); // 디버깅용 로그

    res.status(200).json({
      message: "보호자 목록 조회 성공",
      data: rows,
    });
  } catch (error) {
    console.error("보호자 목록 조회 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;

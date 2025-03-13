const express = require("express");
const router = express.Router();
const pool = require("../db");

// 보호자 정보 추가 라우트
router.post("/add-guardian", async (req, res) => {
  const { user_id, guardian_id, name } = req.body;

  console.log("받은 데이터:", req.body);

  // 입력값 확인
  if (!user_id || !guardian_id || !name) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  try {
    // 회원가입 여부 확인
    const [userCheck] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [guardian_id]
    );

    if (userCheck.length === 0) {
      return res.status(400).json({
        error: "회원가입되지 않은 사용자는 보호자로 설정할 수 없습니다.",
      });
    }

    // 보호자 정보 삽입 (guardians 테이블)
    const [guardianResult] = await pool.query(
      "INSERT INTO guardians (guardian_id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
      [guardian_id, name]
    );
    console.log("Guardians 테이블 삽입 결과:", guardianResult);

    // 사용자와 보호자 관계 추가 (user_guardians 테이블)
    const [relationResult] = await pool.query(
      "INSERT INTO user_guardians (user_id, guardian_id) VALUES (?, ?)",
      [user_id, guardian_id]
    );
    console.log("User_Guardians 테이블 삽입 결과:", relationResult);

    res.status(201).json({
      message: "보호자 정보와 관계가 성공적으로 저장되었습니다.",
      guardianId: guardian_id,
    });
  } catch (error) {
    console.error("보호자 정보 저장 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;

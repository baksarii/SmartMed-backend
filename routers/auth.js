const express = require("express");
const router = express.Router();
const pool = require("../db"); // db.js 파일 연결

// 로그인 라우트
router.post("/login", async (req, res) => {
  const { user_id, passwd } = req.body; // passwd 사용
  console.log("요청 데이터: ", req.body);

  // 입력값 확인
  if (!user_id || !passwd) {
    return res.status(400).json({ error: "아이디와 비밀번호를 입력해주세요." });
  }

  try {
    // 데이터베이스에서 사용자 찾기
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);
    console.log("조회된 사용자:", rows); // DB에서 조회한 결과 로그

    // 사용자 확인
    if (rows.length === 0) {
      return res.status(401).json({ error: "등록되지 않은 아이디입니다." });
    }

    const user = rows[0];

    // 비밀번호 단순 비교
    if (passwd !== user.passwd) {
      return res
        .status(401)
        .json({ error: "아이디 또는 비밀번호가 잘못되었습니다." });
    }

    // 로그인 성공 응답
    res.status(200).json({
      message: "로그인 성공",
      user: { id: user.id, user_id: user.user_id },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;

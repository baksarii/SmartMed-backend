const express = require("express");
const router = express.Router();
const pool = require("../db");

// 알림 설정 (복약 일정 추가)
router.post("/medications", async (req, res) => {
  console.log("POST /medications 요청 수신:", req.body); // 디버깅 로그 추가
  const { user_id, medicine_name, time, start_date, duration, days_of_week } =
    req.body;

  if (!user_id || !medicine_name || !time || !start_date || !duration) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  try {
    const query = `
      INSERT INTO medication_schedule (user_id, medicine_name, time, start_date, duration, days_of_week, status)
      VALUES (?, ?, ?, ?, ?, ?, '대기')
    `;
    const [result] = await pool.query(query, [
      user_id,
      medicine_name,
      time,
      start_date,
      duration,
      days_of_week || null,
    ]);
    console.log("DB 삽입 결과:", result); // DB 결과 로깅
    res
      .status(201)
      .json({
        message: "복약 일정이 저장되었습니다.",
        insertId: result.insertId,
      });
  } catch (error) {
    console.error("복약 일정 저장 오류:", error);
    res
      .status(500)
      .json({ error: "서버 오류가 발생했습니다.", details: error.message });
  }
});

// 사용자 복약 일정 조회
router.get("/medications", async (req, res) => {
  console.log("GET /medications 요청 수신:", req.query); // 디버깅 로그 추가
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "사용자 ID가 필요합니다." });
  }

  try {
    const query = `
      SELECT id, medicine_name, time, start_date, duration, days_of_week, status
      FROM medication_schedule
      WHERE user_id = ? 
      AND DATE(NOW()) BETWEEN start_date AND DATE_ADD(start_date, INTERVAL duration - 1 DAY)
    `;
    const [rows] = await pool.query(query, [user_id]);
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error("복약 일정 조회 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// 복약 상태 변경
router.patch("/medications/:id", async (req, res) => {
  console.log("PATCH /medications/:id 요청 수신:", req.params, req.body); // 디버깅 로그 추가
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "상태 값이 필요합니다." });
  }

  try {
    const query = `
      UPDATE medication_schedule
      SET status = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [status, id]);
    res.status(200).json({ message: "복약 상태가 업데이트되었습니다." });
  } catch (error) {
    console.error("복약 상태 변경 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;

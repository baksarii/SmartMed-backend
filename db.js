const mysql = require("mysql2/promise");
require("dotenv").config();

// MySQL 연결 설정
const pool = mysql.createPool({
  host: "localhost", // 데이터베이스 호스트
  user: "root", // 데이터베이스 사용자
  password: "1234", // 데이터베이스 비밀번호
  database: "medicine2", // 사용할 데이터베이스 이름
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;

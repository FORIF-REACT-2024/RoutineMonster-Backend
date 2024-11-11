import express from "express";
import session from "express-session";
import cors from "cors";

import { usersRouter } from "./routes/users.router.js";
import { routineRouter } from "./routes/routine.router.js";
import { dateRouter } from "./routes/date.router.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  session({
    secret: "your_secret_key", // 보안을 위한 비밀 키
    resave: false, // 세션이 수정되지 않은 경우에도 세션 저장소에 다시 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
    cookie: {
      httpOnly: true, // 자바스크립트 접근 방지
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 작동
      maxAge: 24 * 60 * 60 * 1000, // 1일 동안 유효
    },
  })
);
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/routine", routineRouter);
app.use("/api/date", dateRouter);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

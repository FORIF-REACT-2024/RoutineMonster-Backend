import { OAuth2Client } from "google-auth-library";
import { findUserM, makeUserM } from "../models/users.model.js";

const client = new OAuth2Client();

// idToken 검증
async function verifyIdToken(credential, clientId) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    return res.status(401).json({ error: "Not authenticated" });
  }
}

// signin(req, res): 로그인
export async function signin(req, res) {
  const { credential, clientId } = req.body;
  const payload = verifyIdToken(credential, clientId);
  const user = await findUserM(payload.email);

  if (user) {
    req.session.userId = user.id;
    return res.json({
      ok: true,
      data: { name: user.name, email: user.email, deadtime: user.deadtime },
    });
  } else {
    return res.json({ ok: false, message: "Need Signup" });
  }
}

// signup(req, res): 회원가입
export async function signup(req, res) {
  const { credential, clientId, name, deadtime } = req.body;
  const payload = verifyIdToken(credential, clientId);
  const email = payload.email;
  try {
    makeUser = await makeUserM(name, email, deadtime);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Signup failed" });
  }
}

// signout(req, res): 로그아웃
export async function signout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ ok: false, error: "Signout failed" });
    }
    res.clearCookie("connect.sid"); // 기본 세션 쿠키 이름
    res.json({ message: "Signed out" });
  });
}

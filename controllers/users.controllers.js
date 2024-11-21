import { OAuth2Client } from "google-auth-library";
import { findUserM, makeUserM } from "../models/users.model.js";

const clientId = process.env.CLIENT_ID;
const client = new OAuth2Client(clientId);

// idToken 검증
async function verifyIdToken(credential) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
  }
}

// signin(req, res): 로그인, 회원가입
export async function signin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential || !clientId) {
      return res
        .status(400)
        .json({ success: false, message: "ID token is required" });
    }

    const payload = await verifyIdToken(credential);
    if (!payload) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const { email, name } = payload;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }
    let user = await findUserM(email);

    if (!user) {
      user = await makeUserM(name, email);
    }

    req.session.userId = user.id;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { name: user.name, email: user.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error during signin", error: error });
  }
}

// signout(req, res): 로그아웃
export async function signout(req, res) {
  req.session.destroy((error) => {
    if (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Error during signout",
          error: error,
        });
    }
    res.clearCookie("connect.sid"); // 기본 세션 쿠키 이름
    res.status(200).json({ success: true, message: "Signed out successful" });
  });
}

// session(req, res): 세션 정보 확인
export async function session(req, res) {
  if (!req.session || !req.session.userId) {
    return res
      .status(401)
      .json({ success: false, message: "No active session" });
  }

  return res.status(200).json({
    success: true,
    message: "Session active",
    data: {
      userId: req.session.userId,
    },
  });
}

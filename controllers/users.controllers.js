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
    console.error("Token verification error:", error);
  }
}

// signin(req, res): 로그인, 회원가입
export async function signin(req, res) {
  try {
    console.log("Request body:", req.body);

    const { credential, clientId } = req.body;

    if (!credential || !clientId) {
      return res
        .status(400)
        .json({ success: false, message: "ID token is required" });
    }

    const payload = verifyIdToken(credential, clientId);
    if (!payload) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const { name, email } = payload;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }

    let user = await findUserM(email);

    if (!user) {
      user = makeUserM(name, email);
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
      .json({ success: false, message: "Error during signin" });
  }
}

// signout(req, res): 로그아웃
export async function signout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error during signout" });
    }
    res.clearCookie("connect.sid"); // 기본 세션 쿠키 이름
    res.status(200).json({ success: true, message: "Signed out successful" });
  });
}

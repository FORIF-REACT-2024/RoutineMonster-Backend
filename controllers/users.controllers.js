// signOut(req, res): 로그아웃
import { OAuth2Client } from "google-auth-library";
import { findUser } from "../models/users.model";

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
    return res.status(401).send({ error: error.message });
  }
}

// signIn(req, res): 회원가입, 로그인
async function signIn(req, res) {
  const { credential, clientId } = req.body;
  const payload = verifyIdToken(credential, clientId);
  const existingUser = await findUser(payload.email);

  let user;
  if (!existingUser) {
  }
}

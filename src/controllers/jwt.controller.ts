import jwt, { Secret } from "jsonwebtoken";

export class JwtController {
  static createToken(payload: string) {
    const accessToken = jwt.sign(
      { data: payload },
      process.env.SECRET as Secret,
      {
        expiresIn: "1h",
      }
    );

    try {
      return { accessToken: accessToken };
    } catch (error) {
      console.error(error);
    }
  }
}

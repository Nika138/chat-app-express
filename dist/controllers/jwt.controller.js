import jwt from "jsonwebtoken";
export class JwtController {
    static createToken(payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET, {
            expiresIn: "1h",
        });
        try {
            return accessToken;
        }
        catch (error) {
            console.error(error);
        }
    }
}

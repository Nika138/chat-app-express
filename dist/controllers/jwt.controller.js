import jwt from "jsonwebtoken";
export class JwtController {
    static createToken(payload) {
        const accessToken = jwt.sign({ data: payload }, process.env.SECRET, {
            expiresIn: "1h",
        });
        try {
            return { accessToken: accessToken };
        }
        catch (error) {
            console.error(error);
        }
    }
}

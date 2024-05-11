var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserEntity } from "../models/user.entity.js";
import { JwtController } from "./jwt.controller.js";
import bcrypt from "bcrypt";
import { myDataSource } from "../config.js";
export class AuthController {
    static signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = req.body;
            const salt = yield bcrypt.genSalt();
            const hashedPassword = yield bcrypt.hash(password, salt);
            const user = myDataSource.getRepository(UserEntity).create({
                username,
                email,
                password: hashedPassword,
            });
            try {
                yield myDataSource.getRepository(UserEntity).save(user);
                res.send(user);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    static signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield myDataSource
                .getRepository(UserEntity)
                .findOne({ where: { email } });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Email or password is incorrect" });
            }
            if (user && (yield bcrypt.compare(password, user.password))) {
                const token = JwtController.createToken(user.email);
                try {
                    res.send({
                        access_token: token === null || token === void 0 ? void 0 : token.accessToken,
                    });
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                return res.status(400).json({ message: "Password is incorrect" });
            }
        });
    }
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, new_password } = req.body;
            const user = yield myDataSource
                .getRepository(UserEntity)
                .findOne({ where: { email: email } });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: "User with that email doesn't exist" });
            }
            if (user) {
                const salt = yield bcrypt.genSalt();
                const hashedPassword = yield bcrypt.hash(new_password, salt);
                user.password = hashedPassword;
                try {
                    yield myDataSource.getRepository(UserEntity).save(user);
                    res.send("Password changed successfully");
                }
                catch (error) {
                    console.error(error);
                }
            }
        });
    }
}

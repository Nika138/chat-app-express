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
                // await myDataSource.getRepository(UserEntity).save(user);
                res.send(user);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}

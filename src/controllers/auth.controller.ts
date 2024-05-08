import { Repository } from "typeorm";
import { UserEntity } from "../models/user.entity.js";
import { JwtController } from "./jwt.controller.js";
import bcrypt from "bcrypt";
import { myDataSource } from "../config.js";

export class AuthController {
  static async signUp(req: any, res: any): Promise<void> {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = myDataSource.getRepository(UserEntity).create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await myDataSource.getRepository(UserEntity).save(user);
      res.send(user);
    } catch (error) {
      console.error(error);
    }
  }
}

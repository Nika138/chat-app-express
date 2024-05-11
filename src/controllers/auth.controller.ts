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

  static async signIn(req: any, res: any) {
    const { email, password } = req.body;

    const user = await myDataSource
      .getRepository(UserEntity)
      .findOne({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = JwtController.createToken(user.email);

      try {
        res.send({
          access_token: token?.accessToken,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      return res.status(400).json({ message: "Password is incorrect" });
    }
  }

  static async forgotPassword(req: any, res: any) {
    const { email, new_password } = req.body;

    const user = await myDataSource
      .getRepository(UserEntity)
      .findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User with that email doesn't exist" });
    }

    if (user) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(new_password, salt);

      user.password = hashedPassword;

      try {
        await myDataSource.getRepository(UserEntity).save(user);
        res.send("Password changed successfully");
      } catch (error) {
        console.error(error);
      }
    }
  }
}

import { DataSource } from "typeorm";
export const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1325476980",
    database: "express-app",
    entities: ["__dirname + '/../**/*.entity.js"],
    logging: true,
    synchronize: true,
});

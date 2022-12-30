import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "login",
    synchronize: true,
    logging: false,
    entities: [
        "src/entity/**/*.ts", "./dist/entity/*.js"
     ],
    migrations: [
        "src/migration/**/*.ts"
     ],
    subscribers: [
        "src/subscriber/**/*.ts"
     ],
})

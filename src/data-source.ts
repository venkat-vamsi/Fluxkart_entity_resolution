import "reflect-metadata";
import { DataSource } from "typeorm";
import { Contact } from "./Contact";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "vamsi",
    database: "fluxkart",
    synchronize: true,
    logging: false,
    entities: [Contact],
    subscribers: [],
    migrations: [],
});
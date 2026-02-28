import "reflect-metadata";
import { DataSource } from "typeorm";
import { Contact } from "./Contact";

export const AppDataSource = new DataSource({
    type: "postgres",
    
    url: process.env.DATABASE_URL, 

    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "bitespeed",
    
    synchronize: true,
    logging: false,
    entities: [Contact],
    subscribers: [],
    migrations: [],
    
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});
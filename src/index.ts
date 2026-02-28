import express from "express";
import path from "path";
import { AppDataSource } from "./data-source";
import { identify } from "./identify";

const app = express();
app.use(express.json());

app.use(express.static('public'));

app.post("/identify", identify);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log("Database connection failed", error));
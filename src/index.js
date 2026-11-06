import dotenv from "dotenv"
import app from "./app.js"
import connetDB from "./db/index.js";

dotenv.config({
    path : "./.env",
})

const port = process.env.PORT || 3000;

connetDB()
.then(() => {
    app.listen(port, () => {
    console.log(`Example app listing on port http://localhost:${port}`);
})
})
.catch((err) => {
    console.error("MonogoDB connection error", err);
})



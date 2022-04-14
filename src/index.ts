import App from "./express";
import MsAuthRepo from "./services/auth/repo/mssql";
import { config, ConnectionPool } from 'mssql'
import * as dotenv from 'dotenv';
import { AuthRouter } from "./routers/AuthRouter";
import AuthService from "./services/auth";
import AuthController from "./controllers/auth";

dotenv.config();
// repos

async function main() {
    const sqlConfig: config = {
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        server: "localhost",
        options: {
            // encrypt: true, // for azure
            trustServerCertificate: true, // change to true for local dev / self-signed certs
        },
        beforeConnect: (conn) => {
            conn.once('connect', (err) => err ? console.log(err) : console.log("Connected!"));
        }
    };
    const sql = await new ConnectionPool(sqlConfig).connect();
    const authRepo = new MsAuthRepo(sql);

    const authService = new AuthService(authRepo);

    const authController = new AuthController(authService);

    
    const app = new App({
        port: 3000,
        middleWares: [],
        routers: [
            new AuthRouter(authController)
        ]
    });
    
    await app.listen();
}

main().then();
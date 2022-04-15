import App from "./express";
import MsAuthRepo from "./services/auth/repo/mssql";
import { config, ConnectionPool } from 'mssql'
import * as dotenv from 'dotenv';
import { AuthRouter } from "./routers/AuthRouter";
import AuthService from "./services/auth";
import AuthController from "./controllers/auth";
import { Pool } from "pg";
import PgAuthRepo from "./services/auth/repo/pg";

dotenv.config();
// repos

async function main() {
    
    const pgSql = new Pool();
    const authRepo = new PgAuthRepo(pgSql);
    const authService = new AuthService(authRepo);

    var authController = new AuthController(authService);



    
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
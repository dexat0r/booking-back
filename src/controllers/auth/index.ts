import { Request, Response } from 'express';
import AuthService from '../../services/auth';


export default class AuthController {

    constructor (private authService: AuthService) {}

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw {};
            }

            const resp = await this.authService.login(email, password);
            res.status(200).json(resp);
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Error");
        }
    }

    register = async (req: Request, res: Response) => {
        try {
            const { email, password, role } = req.body;

            if (!email || !password) {
                throw {};
            }
            console.log('123',req.body)
            const resp = await this.authService.register(email, password, Number(role));
            res.status(200).json(resp);
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Error");
        }
    }
}
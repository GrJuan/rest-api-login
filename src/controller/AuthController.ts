/*IMPORTS  */
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { Request, Response } from 'express';


import { User } from "../entity/User";
import { AppDataSource } from '../data-source';



require('dotenv').config();

class AuthController {

    /*LOGIN */

    static login = async (req: Request, res: Response) => {

        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail({ where: { email } });

            if (!user.checkPassword(password)) {
                return res.status(400).json({ message: 'email & Password are required pass!' });
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET, { expiresIn: '1h' })

            res.status(200).json({ token, id: user.id });

        } catch (e) {
            return res.status(400).json({ message: 'email or Password incorrect!' })
        }

    };

    /*CHANGE PASSWORD */

    static changePassword = async (req: Request, res: Response) => {
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword, activityDate } = req.body;


        const userRepository = AppDataSource.getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneBy({ id: userId });        }
        catch (e) {
            res.status(400).json({ message: 'Something went wrong!' })
        }

        if (!user.checkPassword(oldPassword)) {
            return res.status(401).json({ message: 'Check the old password!' })
        }

        user.password = newPassword;
        user.activityDate = activityDate;

        const validationOps = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOps)
        console.log(errors);

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Something went wrong!' });
        }

        //HASH PASSWORD
        user.hashPassword();
        userRepository.save(user);

        res.status(200).json({ message: 'Password Changed!' });
    };

    /*FORGOT PASSWORD*/

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;

        let linkResetPassword;

        const userRepository = AppDataSource.getRepository(User);

        let user: User;

        try {
            user = await userRepository.findOneBy({ email:  email  });
            console.log(user);

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET_RESET, { expiresIn: '1h' });

            linkResetPassword = process.env.URL_FRONT_APP + `/reset-password/${token}`;

            user.resetToken = token;

        } catch (error) {
            return res.status(400).json({ message: 'Something goes wrong' });
        }

        try {
            await userRepository.save(user);
        } catch (error) {
            return res.status(400).json({ message: 'Something goes wrong' });
        }

        res.status(200).json({ message: linkResetPassword });


    };
}

export default AuthController;
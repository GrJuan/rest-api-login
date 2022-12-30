import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";
import * as jwt from "jsonwebtoken";

import { AppDataSource } from "../data-source";
require('dotenv').config();


export class UserController {

    /*List all registered users */

    static getAllUsers = async (req: Request, res: Response) => {
        const userRepository = AppDataSource.getRepository(User);

        let users;
        try {
            users = await userRepository.find();
        }
        catch (e) {
            res.status(400).json({ message: 'Not Result.' });
        }

        if (users.length > 0) {
            res.send(users);
        } else {
            res.status(400).json({ message: 'Not Result.' });
        }
    };

    /*SEARCH USER BY ID*/

    static getByUserId = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        try {
            const user = await userRepository.findOneBy({ id: id });
            res.send(user);
        } catch (e) {
            res.status(400).json({ message: 'Without result' });
        }
    };

    /*REGISTER A USER*/

    static newUser = async (req: Request, res: Response) => {
        const {
            firstName,
            lastName,
            email,
            password,
            age,
            phone,
            country,
            activityDate
        } = req.body;
        const user = new User();

        let tokenActivation = '';


        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = password;
        user.age = age;
        user.phone = phone;
        user.country = country;
        user.activityDate = activityDate;
        user.status = true;
        user.activationCode = '';
        user.resetToken = '';
        user.role = 'user';


        /* Validating the user object against the validationError object. */
        const validationError = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationError);

        if (errors.length > 0) {
            return res.status(401).json({ message: errors });
        };
        const userRepository = AppDataSource.getRepository(User)


        //validate Duplicate Email
      
        try {
            const validateEmail = await userRepository.findOneOrFail({ where: { email } });
            if (validateEmail){ return res.status(400).json({message:'Email already exists'});}
        } catch (error) {
            console.log(error)
        }
       


        /* Generating a random string of 7 characters. */
        let code = (Math.random() + 1).toString(36).substring(7);



        /*This function generates an activation token for a user by first creating a hash password and activation code, 
        then saving the code to the user and generating a token with the user's data. */
        try {
            user.hashPassword();
            tokenActivation = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    code: code
                },
                process.env.JWT_SECRET, { expiresIn: '1h' });

            user.activationCode = code;
            await userRepository.save(user);
        } catch (e) {
            return res.status(401).json({ message: "An error occurred with validation!" })
        }

        res.status(201).json({ message: "Registered user" })
    };

    /*EDIT A USER*/

    static editUser = async (req: Request, res: Response) => {

        let user;

        const { id } = req.params;

        const {
            firstName,
            lastName,
            email,
            password,
            age,
            phone,
            country,
            activityDate
        } = req.body;

        const userRepository = AppDataSource.getRepository(User);

        try {
            user = await userRepository.findOneBy({ id: id });

        } catch (e) {
            return res.status(400).json({ message: 'User not found!' })
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = password;
        user.age = age;
        user.phone = phone;
        user.country = country;
        user.activityDate = activityDate;


        const validationOpt = { validateError: { target: false, value: false } };
        const errors = await validate(user, validationOpt);

        if (errors.length > 0) {
            return res.status(401).json({ message: errors });
        };

        /*SAVE USER */
        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(400).json({ message: 'Username already exists' })
        }
        res.status(201).json({ message: 'Updated User' })

    };

    /*DELETE A USER*/

    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneBy({ id: id });
        } catch (e) {
            return res.status(400).json({ message: 'User not found' });
        }

        userRepository.delete(id);
        res.status(201).json({ message: 'User Deleted' });
    };

}

export default UserController;
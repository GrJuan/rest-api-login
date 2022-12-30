import { Router } from "express";

import AuthController from "../controller/AuthController";

import { checkJwt } from "../middlewares/jwt";

const router = Router();

router.post('/login', AuthController.login);

router.post('/change-password',  [checkJwt], AuthController.changePassword);

router.put('/forgot-password', AuthController.forgotPassword)


export default router;
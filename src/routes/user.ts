import { Router } from "express";

//imports
import { UserController } from "../controller/UserController";
import { checkJwt } from "../middlewares/jwt";

const router = Router();

router.get('/', UserController.getAllUsers);

router.get('/search/:id', UserController.getByUserId);

router.post('/', UserController.newUser);

router.patch('/:id', UserController.editUser);

router.delete('/delete/:id', UserController.deleteUser);


export default router;

//PERMISOS DE ADMIN
//checkRole(['admin'])

//PERMISO AUTH CON TOKEN
//[checkJwt]
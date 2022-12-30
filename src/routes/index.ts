import { Router } from 'express';

import user from './user'
import auth from './auth'


const routes = Router();

routes.use('/user', user);
routes.use('/auth', auth);



export default routes;
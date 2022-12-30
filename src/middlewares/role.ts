import { Request,Response,NextFunction } from "express";

/*IMPORT ENTITIES */
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";


export const checkRole =  (roles:Array<string>) => {
    return async (req: Request,res: Response,next: NextFunction) => {
        const {userId} =  res.locals.jwtPayload;
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
    
        try{
            user = await userRepository.findOneOrFail(userId);
        }catch(e){
            return res.status(401).json({message:'No Authorized.'});
        }

        const {role}  = user;

        if(roles.includes(role)){
            next();
        }else{
            res.status(401).json({message:  'No Authorized.'});
        }

    }
}
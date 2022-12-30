import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    
    
    const token = <string>req.headers['auth'];
    let jwtPayload;

    try{
        jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET);
        res.locals.jwtPayload = jwtPayload;
    }
    catch(e){
        return res.status(401).json({message: 'without authorization!'});
    }
    
    
    const {userId, username} = jwtPayload;
    
    const newToken = jwt.sign({userId, username}, process.env.JWT_SECRET, {expiresIn : '1h'});
    res.setHeader('token', newToken);

    next();
}
import type { NextFunction, Request, Response}  from "express";

const SignUp = async (req: Request , res : Response, next : NextFunction) =>{
    res.status(200).send("ok");
    return next();
}

export {SignUp}
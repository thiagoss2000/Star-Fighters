import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

export function validateSchema (authSchema: any){
    
    return async function(request: Request, response: Response, next: NextFunction){
        const { error } = authSchema.validate(request.body, { abortEarly: false });
        
        if (error){
            console.log(chalk.red(`ERROR VALIDATING DATA: ${error.details.map(({message}) => message)}`));
            throw {status: 422}
        }
        next();
    }
}
  
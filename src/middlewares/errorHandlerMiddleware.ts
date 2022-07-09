import {Request, Response} from "express";

export default function errorHandler (error, req: Request, res: Response) {
  console.log(error);
  if (error.response) {
    return res.sendStatus(error.response.status);
  }

  res.sendStatus(500); 
}
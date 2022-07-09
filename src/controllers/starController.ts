import { Request, Response } from "express";
import { battle, ranking } from "../services/starService.js";

export async function postBattle(request: Request, response: Response) {
    const { firstUser, secondUser } : { firstUser: string, secondUser: string} = request.body;
    try {
        const result = await battle(firstUser, secondUser);
        response.send(result);
    } catch {
        response.sendStatus(500);
    }
};

export async function getRanking(request: Request, response: Response) {
    try {
        const result = await ranking();
        response.send(result);
    } catch {
        response.sendStatus(500);        
    }
};
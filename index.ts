import express, { json, request, response } from "express";
import axios from "axios";
import db from "./db.js";
import joi from "joi";
import authRouter from "./routes/authRoute.js";

const app = express();
app.use(json());

//app.use(authRouter);

const authSchema = joi.object({
    firstUser: joi.string().required(),
    secondUser: joi.string().required()
});

app.post("/battle", async (request, response) => {
    const { firstUser, secondUser } = request.body;

    const { error } = authSchema.validate(request.body, { abortEarly: false });        
    if (error) return response.status(422).send(error.details.map(({message}) => message))

    try {
        const id = await db.query(`SELECT id FROM fighters WHERE username = $1`, [firstUser]);
        if (id.rows.length == 0){
            await db.query(`INSERT INTO fighters (username, wins, losses, draws) 
                VALUES ($1, 0, 0, 0)
            `, [firstUser]);
        }
        
        const id2 = await db.query(`SELECT id FROM fighters WHERE username = $1`, [secondUser]);
        if (id2.rows.length == 0){
            await db.query(`INSERT INTO fighters (username, wins, losses, draws) 
                VALUES ($1, 0, 0, 0)
            `, [secondUser]);
        }

        let firstUserStars = 0;
        let secondUserStars = 0;
        const firstUserData = await axios.get(`https://api.github.com/users/${firstUser}/repos`);
        const secondUserData = await axios.get(`https://api.github.com/users/${secondUser}/repos`);
        await firstUserData.data.forEach((obj) => firstUserStars += obj.stargazers_count);
        await secondUserData.data.forEach((obj) => secondUserStars += obj.stargazers_count);

        
        if(firstUserStars == secondUserStars){

            await db.query(`UPDATE fighters SET draws = draws + 1
                WHERE username = $1 OR username = $2`, 
            [firstUser, secondUser]);

            response.send(
                {
                    "winner": null, // nulo se empate
                    "loser": null, //nulo se empate
                    "draw": true // true se empate
                }
            );
            return;
        } else if (firstUserStars < secondUserStars){
            
            await db.query(`UPDATE fighters SET wins = wins + 1
                WHERE username = $1`, 
            [secondUser]);
            await db.query(`UPDATE fighters SET losses = losses + 1
                WHERE username = $1`, 
            [firstUser]);

            response.send(
                {
                    "winner": secondUser, // nulo se empate
                    "loser": firstUser, //nulo se empate
                    "draw": false // true se empate
                }
            );  
            return;
        } else {

            await db.query(`UPDATE fighters SET wins = wins + 1
                WHERE username = $1`, 
            [firstUser]);
            await db.query(`UPDATE fighters SET losses = losses + 1
                WHERE username = $1`, 
            [secondUser]);
            
            response.send(
                {
                    "winner": firstUser, // nulo se empate
                    "loser": secondUser, //nulo se empate
                    "draw": false // true se empate
                }
            );  
            return;
        }


    } catch {
        response.sendStatus(500);
    }
});

app.get("/ranking", async (request, response) => {
    try {
        const ranking = await db.query(`SELECT username, wins, losses, draws 
            FROM fighters ORDER BY wins, draws
        `);
        response.send(ranking.rows);
    } catch {
        response.sendStatus(500);        
    }
});

app.listen(4000, () => console.log("server on port 4000"));
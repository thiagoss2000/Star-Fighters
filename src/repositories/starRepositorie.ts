import db from "../database/db.js";

export async function getUser(userName: string) {
    const data = await db.query(`SELECT * FROM fighters WHERE username = $1`, [userName]);
    return data.rows;
}

export async function newUser(userName: string) {
    const data = await db.query(`INSERT INTO fighters (username, wins, losses, draws) 
        VALUES ($1, 0, 0, 0) RETURNING *
    `, [userName]);
    return data.rows;
}

export function updateDraw(firstUser: number, secondUser: number) {
    return db.query(`UPDATE fighters SET draws = draws + 1
        WHERE id = $1 OR id = $2`, 
    [firstUser, secondUser]);
}

export function updateWin(userName: number) {
    return db.query(`UPDATE fighters SET wins = wins + 1
        WHERE id = $1`, 
    [userName]);
}

export function updateLosse(userName: number) {
    return db.query(`UPDATE fighters SET losses = losses + 1
        WHERE id = $1`, 
    [userName]);
}

export async function getRanking() {
    const ranking = await db.query(`SELECT username, wins, losses, draws 
        FROM fighters ORDER BY wins DESC, draws DESC
    `);
    return ranking.rows;
}
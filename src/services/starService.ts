import axios from "axios";
import { getRanking, getUser, newUser, updateDraw, updateLosse, updateWin } from "../repositories/starRepositorie.js";

export async function ranking() {
    return getRanking();
}

export async function battle(firstUser: string, secondUser: string) {
    const numStarsFirstUser = await getNumStars(firstUser);
    const numStarsSecondUser = await getNumStars(secondUser);

    if(numStarsFirstUser > numStarsSecondUser) {
        await sendWin_Losse(firstUser, secondUser);
        return {
            winner: firstUser,
            loser: secondUser,
            draw: false,
        };
    } else if(numStarsFirstUser < numStarsSecondUser){
        await sendWin_Losse(secondUser, firstUser);
        return {
            winner: secondUser,
            loser: firstUser,
            draw: false,
        };
    } else {
        await sendDraw(firstUser, secondUser);
        return { winner: null, loser: null, draw: true };
    }
}

async function getNumStars(userName: string) {
    let userStars = 0;
    const userData = await axios.get(`https://api.github.com/users/${userName}/repos`);
    userData.data.forEach((obj: {stargazers_count: number}) => userStars += obj.stargazers_count);
    
    return userStars;
}

async function sendWin_Losse(winUser: string, losseUser: string) {
    const idWin = await getIdUser(winUser);
    await updateWin(idWin);
    const idLosse = await getIdUser(losseUser);
    await updateLosse(idLosse);
}

async function sendDraw(firstUser: string, secondUser: string) {
    const firstId = await getIdUser(firstUser);
    const secondId = await getIdUser(secondUser);
    updateDraw(firstId, secondId);
}

async function getIdUser(userName: string) {
    let data = await getUser(userName);
    if (data.length == 0) 
        data = await newUser(userName);
    return data[0].id;
}
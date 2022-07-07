import router from "express";
import { getRanking, postBattle } from "../controllers/authController";

const authRouter = router();

authRouter.post("/battle", postBattle);
authRouter.get("/ranking", getRanking);

export default authRouter;
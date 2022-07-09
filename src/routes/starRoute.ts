import router from "express";
import { getRanking, postBattle } from "../controllers/starController.js";
import { validateSchema } from "../middlewares/battleMiddleware.js";
import { authSchema } from "../schemas/battleSchema.js";

const authRouter = router();

authRouter.post("/battle", validateSchema(authSchema), postBattle);
authRouter.get("/ranking", getRanking);

export default authRouter;
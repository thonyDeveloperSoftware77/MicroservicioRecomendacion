import { Router } from "express";
import { getRecomendacion} from "../CONTROLLERS/recomendacionController"
const router = Router();

router.get('/:id', getRecomendacion);

export default router;
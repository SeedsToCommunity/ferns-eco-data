import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import bonapRouter from "./bonap.js";
import gbifRouter from "./gbif.js";
import registryRouter from "./registry.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bonapRouter);
router.use(gbifRouter);
router.use(registryRouter);

export default router;

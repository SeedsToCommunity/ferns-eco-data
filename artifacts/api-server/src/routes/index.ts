import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import bonapRouter from "./bonap.js";
import gbifRouter from "./gbif.js";
import inatRouter from "./inat.js";
import registryRouter from "./registry.js";
import specRouter from "./spec.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bonapRouter);
router.use(gbifRouter);
router.use(inatRouter);
router.use(registryRouter);
router.use(specRouter);

export default router;

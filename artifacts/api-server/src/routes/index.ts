import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import bonapRouter from "./bonap.js";
import gbifRouter from "./gbif.js";
import inatRouter from "./inat.js";
import mifloraRouter from "./miflora.js";
import coefficientRouter from "./coefficient.js";
import wetlandIndicatorRouter from "./wetland-indicator.js";
import wucolsRouter from "./wucols.js";
import registryRouter from "./registry.js";
import specRouter from "./spec.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bonapRouter);
router.use(gbifRouter);
router.use(inatRouter);
router.use(mifloraRouter);
router.use(coefficientRouter);
router.use(wetlandIndicatorRouter);
router.use(wucolsRouter);
router.use(registryRouter);
router.use(specRouter);

export default router;

import { Router } from "express";
import {
  listProducts,
  getProduct,
  getFeatured,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import {
  listReviews,
  createReview,
  deleteReview,
} from "../controllers/reviewController";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";
import { createReviewSchema } from "../schemas/review.schema";

const router = Router();

router.get("/", listProducts);
router.get("/featured", getFeatured);
router.get("/search", searchProducts);
router.get("/:id", getProduct);
router.get("/:id/reviews", listReviews);

router.post(
  "/:id/reviews",
  authMiddleware,
  validate(createReviewSchema),
  createReview,
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(createProductSchema),
  createProduct,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(updateProductSchema),
  updateProduct,
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
router.delete("/reviews/:id", authMiddleware, adminMiddleware, deleteReview);

export default router;

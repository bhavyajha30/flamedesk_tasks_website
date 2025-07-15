import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createChallenge,
  deleteChallenge,
  getChallengeById,
  getChallenges,
  updateChallenge,
} from "../controllers/challengeContrller.js";

const challengeRouter = express.Router();

challengeRouter
  .route("/gp")
  .get(authMiddleware, getChallenges)
  .post(authMiddleware, createChallenge);

challengeRouter
  .route("/:id/gp")
  .get(authMiddleware, getChallengeById)
  .put(authMiddleware, updateChallenge)
  .delete(authMiddleware, deleteChallenge);

export default challengeRouter;
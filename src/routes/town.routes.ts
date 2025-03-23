import express from "express";
import { getTown, createTown, updateTown, deleteTown } from "../controllers/town.controller";
import { TownRepository } from "../repositories/town.repo";


const router = express.Router();

router.get("/", getTown);
router.post("/", createTown);
router.patch("/:id", updateTown);
router.delete("/:id",deleteTown);
// router.get('/rename', async (req, res) => {
//     const oldName = 'town';
//     const newName = 'towns';
//     const result = await TownRepository.renameCollection(oldName, newName);
//     res.status(result.success ? 200 : 400).json(result);
//   });

export default router;

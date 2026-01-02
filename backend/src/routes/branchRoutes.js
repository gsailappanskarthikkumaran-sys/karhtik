import express from 'express';
import { getBranches, getBranchById, addBranch, deleteBranch } from '../controllers/branchController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getBranches)
    .post(protect, admin, addBranch);

router.route('/:id')
    .get(protect, getBranchById)
    .delete(protect, admin, deleteBranch);

export default router;

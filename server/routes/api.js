import express from 'express';
import { createLink, getAllLinks, getLinkStats, deleteLink } from '../controllers/linkController.js';

const router = express.Router();

router.post('/links', createLink);
router.get('/links', getAllLinks);
router.get('/links/:code', getLinkStats);
router.delete('/links/:code', deleteLink);

export default router;

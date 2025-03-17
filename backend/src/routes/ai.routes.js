import express from 'express';
import { getResult } from '../controller/ai.controller.js';

const router = express.Router();


router.get("/" , getResult )



export default router;
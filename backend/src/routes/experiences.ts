import { Router } from 'express';
import Experience from '../models/Experience';

const router = Router();

// GET /api/experiences
router.get('/', async (req, res) => {
  const exps = await Experience.find();
  res.json(exps);
});

// GET /api/experiences/:id
router.get('/:id', async (req, res) => {
  const exp = await Experience.findById(req.params.id);
  if (!exp) return res.status(404).json({ message: 'Not found' });
  res.json(exp);
});

export default router;

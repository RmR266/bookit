import { Router } from 'express';
const router = Router();

type Promo = { type: 'percent' | 'flat'; value: number };
const promos: Record<string, Promo> = {
  SAVE10: { type: 'percent', value: 10 },
  FLAT100: { type: 'flat', value: 100 },
};

router.post('/validate', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ valid: false });

  const upper = String(code).toUpperCase();
  const promo = promos[upper]; // ✅ no TypeScript error now

  if (!promo) return res.json({ valid: false });
  return res.json({ valid: true, promo });
});

export default router;

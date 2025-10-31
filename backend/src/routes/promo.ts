import { Router } from 'express';
const router = Router();

type Promo = { type: 'percent' | 'flat'; value: number };
const promos: Record<string, Promo> = {
  SAVE10: { type: 'percent', value: 10 },
  FLAT100: { type: 'flat', value: 100 },
};

router.post('/validate', (req, res) => {
  const { code, subtotal } = req.body; 
  if (!code) return res.status(400).json({ valid: false });

  const upper = String(code).toUpperCase();
  const promo = promos[upper];
  if (!promo) return res.json({ valid: false });

  // calculation of discount
  let discountAmount = 0;
  if (promo.type === 'percent' && subtotal) {
    discountAmount = Math.round((subtotal * promo.value) / 100);
  } else if (promo.type === 'flat') {
    discountAmount = promo.value;
  }

  return res.json({
    valid: true,
    promo,
    discountAmount,
  });
});

export default router;

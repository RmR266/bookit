import { Router } from 'express';
const router = Router();

// Sample data for now (until DB connection is ready)
const experiences = [
  {
    _id: '1',
    title: 'Mountain Trekking',
    description: 'Explore the scenic mountain trails.',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
  },
  {
    _id: '2',
    title: 'Scuba Diving',
    description: 'Dive into crystal clear waters.',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1528701800489-20be0b6f3d5d'
  }
];

// GET /api/experiences
router.get('/', (req, res) => {
  res.json(experiences);
});

export default router;

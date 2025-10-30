import express from 'express';
const router = express.Router();

// Sample mock experiences — replace with MongoDB logic if needed
const experiences = [
  {
    _id: '1',
    title: 'Kayaking Adventure',
    description: 'Paddle through scenic backwaters with expert guides.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    location: 'Udupi',
  },
  {
    _id: '2',
    title: 'Mountain Trekking',
    description: 'A thrilling high-altitude experience for adventure lovers.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    location: 'Manali',
  },
  {
    _id: '3',
    title: 'Cultural Food Walk',
    description: 'Explore local delicacies and learn the stories behind them.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    location: 'Jaipur',
  },
  {
    _id: '4',
    title: 'Hot Air Balloon Ride',
    description: 'Soar over breathtaking landscapes in a safe guided flight.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    location: 'Pushkar',
  },
  {
    _id: '5',
    title: 'Beach Yoga Retreat',
    description: 'Relax, rejuvenate, and meditate by the ocean breeze.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    location: 'Goa',
  },
];

// @route   GET /api/experiences
// @desc    Get all experiences
// @access  Public
router.get('/', (req, res) => {
  res.json(experiences);
});

// @route   GET /api/experiences/:id
// @desc    Get single experience by ID
// @access  Public
router.get('/:id', (req, res) => {
  const experience = experiences.find((exp) => exp._id === req.params.id);
  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }
  res.json(experience);
});

export default router;

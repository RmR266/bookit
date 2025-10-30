import express, { Request, Response } from 'express';

const router = express.Router();

// Unified dummy data — every object has `images: string[]`
const dummyExperiences = [
  {
    _id: '1',
    title: 'Kayaking Adventure',
    description:
      'Paddle through calm waters surrounded by breathtaking mountain views. Perfect for beginners and pros alike.',
    price: 1200,
    location: 'Udaipur Lake',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      { date: '2025-10-22', time: '07:00 am', capacity: 10, booked: 6 },
      { date: '2025-10-22', time: '09:00 am', capacity: 10, booked: 8 },
      { date: '2025-10-23', time: '07:00 am', capacity: 10, booked: 2 },
    ],
  },
  {
    _id: '2',
    title: 'Desert Safari Experience',
    description:
      'Explore the golden sands with an off-road jeep adventure followed by a traditional Rajasthani dinner.',
    price: 2200,
    location: 'Jaisalmer',
    images: [
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      { date: '2025-10-22', time: '16:00 pm', capacity: 12, booked: 6 },
      { date: '2025-10-23', time: '16:00 pm', capacity: 12, booked: 12 },
    ],
  },
  {
    _id: '3',
    title: 'Mountain Trek Expedition',
    description:
      'Join a guided trek through scenic trails with panoramic valley views and sunrise photography.',
    price: 3500,
    location: 'Manali',
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      { date: '2025-10-22', time: '05:00 am', capacity: 8, booked: 2 },
      { date: '2025-10-25', time: '05:00 am', capacity: 8, booked: 8 },
    ],
  },
  {
    _id: '4',
    title: 'Scuba Diving Session',
    description:
      'Discover the underwater world with professional guidance and full safety gear provided.',
    price: 5000,
    location: 'Goa',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      { date: '2025-10-22', time: '09:00 am', capacity: 6, booked: 3 },
      { date: '2025-10-22', time: '14:00 pm', capacity: 6, booked: 6 },
    ],
  },
];

// 📍 GET all experiences
router.get('/', async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ experiences: dummyExperiences });
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ message: 'Failed to fetch experiences' });
  }
});

// 📍 GET a single experience by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const experience = dummyExperiences.find((exp) => exp._id === id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.status(200).json({ experience });
  } catch (err) {
    console.error('Error fetching experience:', err);
    res.status(500).json({ message: 'Failed to fetch experience' });
  }
});

export default router;

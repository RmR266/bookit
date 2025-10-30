import express, { Request, Response } from 'express';

const router = express.Router();

// 🧪 Dummy data for testing (replace later with MongoDB model queries)
const dummyExperiences = [
  {
    _id: '1',
    title: 'Kayaking Adventure',
    description:
      'Paddle through calm waters surrounded by breathtaking mountain views. Perfect for beginners and pros alike.',
    price: 1200,
    location: 'Udaipur Lake',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: '2',
    title: 'Desert Safari Experience',
    description:
      'Explore the golden sands with an off-road jeep adventure followed by a traditional Rajasthani dinner.',
    price: 2200,
    location: 'Jaisalmer',
    imageUrl:
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: '3',
    title: 'Mountain Trek Expedition',
    description:
      'Join a guided trek through scenic trails with panoramic valley views and sunrise photography.',
    price: 3500,
    location: 'Manali',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: '4',
    title: 'Scuba Diving Session',
    description:
      'Discover the underwater world with professional guidance and full safety gear provided.',
    price: 5000,
    location: 'Goa',
    imageUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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

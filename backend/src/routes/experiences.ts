import express, { Request, Response } from 'express';

const router = express.Router();

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
      {
        date: '2025-11-01',
        times: [
          { time: '07:00 am', capacity: 10, booked: 6 },
          { time: '09:00 am', capacity: 10, booked: 8 },
          { time: '11:00 am', capacity: 10, booked: 4 },
        ],
      },
      {
        date: '2025-11-02',
        times: [
          { time: '08:00 am', capacity: 10, booked: 5 },
          { time: '10:00 am', capacity: 10, booked: 2 },
          { time: '12:00 pm', capacity: 10, booked: 9 },
        ],
      },
      {
        date: '2025-11-03',
        times: [
          { time: '07:30 am', capacity: 10, booked: 10 },
          { time: '09:30 am', capacity: 10, booked: 3 },
          { time: '11:30 am', capacity: 10, booked: 1 },
        ],
      },
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
      {
        date: '2025-11-01',
        times: [
          { time: '03:00 pm', capacity: 12, booked: 12 },
          { time: '05:00 pm', capacity: 12, booked: 9 },
          { time: '07:00 pm', capacity: 12, booked: 5 },
        ],
      },
      {
        date: '2025-11-02',
        times: [
          { time: '04:00 pm', capacity: 12, booked: 4 },
          { time: '06:00 pm', capacity: 12, booked: 8 },
          { time: '08:00 pm', capacity: 12, booked: 2 },
        ],
      },
      {
        date: '2025-11-03',
        times: [
          { time: '03:30 pm', capacity: 12, booked: 11 },
          { time: '06:30 pm', capacity: 12, booked: 6 },
        ],
      },
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
      {
        date: '2025-11-01',
        times: [
          { time: '05:00 am', capacity: 8, booked: 2 },
          { time: '06:00 am', capacity: 8, booked: 4 },
          { time: '07:00 am', capacity: 8, booked: 6 },
        ],
      },
      {
        date: '2025-11-02',
        times: [
          { time: '05:30 am', capacity: 8, booked: 8 },
          { time: '06:30 am', capacity: 8, booked: 3 },
          { time: '07:30 am', capacity: 8, booked: 1 },
        ],
      },
      {
        date: '2025-11-03',
        times: [
          { time: '04:30 am', capacity: 8, booked: 8 },
          { time: '06:00 am', capacity: 8, booked: 7 },
        ],
      },
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
      {
        date: '2025-11-01',
        times: [
          { time: '09:00 am', capacity: 6, booked: 3 },
          { time: '11:00 am', capacity: 6, booked: 6 },
          { time: '02:00 pm', capacity: 6, booked: 2 },
        ],
      },
      {
        date: '2025-11-02',
        times: [
          { time: '08:00 am', capacity: 6, booked: 4 },
          { time: '10:00 am', capacity: 6, booked: 5 },
          { time: '01:00 pm', capacity: 6, booked: 1 },
        ],
      },
    ],
  },
  {
    _id: '5',
    title: 'Paragliding Over the Hills',
    description:
      'Soar high above the valleys with trained pilots ensuring a safe and thrilling flight.',
    price: 4200,
    location: 'Bir Billing',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      {
        date: '2025-11-02',
        times: [
          { time: '08:00 am', capacity: 5, booked: 5 },
          { time: '09:00 am', capacity: 5, booked: 3 },
          { time: '10:00 am', capacity: 5, booked: 2 },
        ],
      },
      {
        date: '2025-11-03',
        times: [
          { time: '07:30 am', capacity: 5, booked: 5 },
          { time: '09:30 am', capacity: 5, booked: 3 },
        ],
      },
    ],
  },
  {
    _id: '6',
    title: 'Hot Air Balloon Ride',
    description:
      'Enjoy a peaceful sunrise ride with panoramic views and gentle winds guiding your journey.',
    price: 5500,
    location: 'Jaipur',
    images: [
      'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      {
        date: '2025-11-01',
        times: [
          { time: '06:00 am', capacity: 10, booked: 9 },
          { time: '06:30 am', capacity: 10, booked: 10 },
          { time: '07:00 am', capacity: 10, booked: 7 },
        ],
      },
      {
        date: '2025-11-02',
        times: [
          { time: '05:30 am', capacity: 10, booked: 5 },
          { time: '07:00 am', capacity: 10, booked: 6 },
        ],
      },
    ],
  },
  {
    _id: '7',
    title: 'Jungle Safari Tour',
    description:
      'Explore the wildlife with guided tours and close encounters in natural habitats.',
    price: 2800,
    location: 'Ranthambore',
    images: [
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      {
        date: '2025-11-01',
        times: [
          { time: '05:00 am', capacity: 15, booked: 13 },
          { time: '06:00 am', capacity: 15, booked: 15 },
          { time: '05:30 am', capacity: 15, booked: 7 },
        ],
      },
      {
        date: '2025-11-02',
        times: [
          { time: '04:30 am', capacity: 15, booked: 12 },
          { time: '06:00 am', capacity: 15, booked: 14 },
          { time: '07:00 am', capacity: 15, booked: 10 },
        ],
      },
    ],
  },
  {
    _id: '8',
    title: 'Wine Tasting Retreat',
    description:
      'Savor fine wines and learn about winemaking in this peaceful vineyard experience.',
    price: 1800,
    location: 'Nashik',
    images: [
      'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      {
        date: '2025-11-03',
        times: [
          { time: '01:00 pm', capacity: 10, booked: 4 },
          { time: '03:00 pm', capacity: 10, booked: 10 },
          { time: '05:00 pm', capacity: 10, booked: 6 },
        ],
      },
      {
        date: '2025-11-04',
        times: [
          { time: '12:00 pm', capacity: 10, booked: 2 },
          { time: '02:00 pm', capacity: 10, booked: 5 },
        ],
      },
    ],
  },
  {
    _id: '9',
    title: 'Snowboarding Basics',
    description:
      'Learn snowboarding on gentle slopes with certified trainers and full gear included.',
    price: 4800,
    location: 'Gulmarg',
    images: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      {
        date: '2025-11-02',
        times: [
          { time: '09:00 am', capacity: 6, booked: 4 },
          { time: '11:00 am', capacity: 6, booked: 6 },
          { time: '02:00 pm', capacity: 6, booked: 1 },
        ],
      },
      {
        date: '2025-11-03',
        times: [
          { time: '08:00 am', capacity: 6, booked: 3 },
          { time: '10:00 am', capacity: 6, booked: 2 },
          { time: '01:00 pm', capacity: 6, booked: 6 },
        ],
      },
    ],
  },
  {
    _id: '10',
    title: 'City Heritage Walk',
    description:
      'Walk through ancient streets and experience local culture with an expert guide.',
    price: 900,
    location: 'Delhi',
    images: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      {
        date: '2025-11-01',
        times: [
          { time: '08:00 am', capacity: 20, booked: 10 },
          { time: '10:00 am', capacity: 20, booked: 12 },
          { time: '05:00 pm', capacity: 20, booked: 15 },
        ],
      },
      {
        date: '2025-11-02',
        times: [
          { time: '09:00 am', capacity: 20, booked: 18 },
          { time: '06:00 pm', capacity: 20, booked: 19 },
        ],
      },
    ],
  },
  {
    _id: '11',
    title: 'Cooking Class with Locals',
    description:
      'Cook traditional dishes with local chefs and enjoy the feast together.',
    price: 2500,
    location: 'Chennai',
    images: [
      'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      {
        date: '2025-11-01',
        times: [
          { time: '11:00 am', capacity: 6, booked: 3 },
          { time: '12:30 pm', capacity: 6, booked: 6 },
          { time: '02:00 pm', capacity: 6, booked: 1 },
          { time: '04:00 pm', capacity: 6, booked: 2 },
        ],
      },
      {
        date: '2025-11-02',
        times: [
          { time: '11:00 am', capacity: 6, booked: 2 },
          { time: '01:00 pm', capacity: 6, booked: 0 },
          { time: '03:00 pm', capacity: 6, booked: 1 },
        ],
      },
    ],
  },
  {
    _id: '12',
    title: 'Cycling Through Countryside',
    description:
      'Ride through scenic landscapes and rural roads with local guides.',
    price: 1500,
    location: 'Coorg',
    images: [
      'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80',
    ],
    slots: [
      {
        date: '2025-11-02',
        times: [
          { time: '07:00 am', capacity: 12, booked: 7 },
          { time: '09:00 am', capacity: 12, booked: 10 },
          { time: '11:00 am', capacity: 12, booked: 11 },
        ],
      },
      {
        date: '2025-11-03',
        times: [
          { time: '06:00 am', capacity: 12, booked: 5 },
          { time: '08:30 am', capacity: 12, booked: 8 },
          { time: '10:00 am', capacity: 12, booked: 2 },
        ],
      },
    ],
  },
];


// ✅ GET all experiences
router.get('/', async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ experiences: dummyExperiences });
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ message: 'Failed to fetch experiences' });
  }
});

// ✅ GET single experience by ID
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

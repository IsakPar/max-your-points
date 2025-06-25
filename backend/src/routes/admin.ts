import { Router } from 'express';

const router: Router = Router();

// Placeholder admin routes - will be implemented later
router.get('/health', (req, res) => {
  res.json({ message: 'Admin routes available' });
});

export default router; 
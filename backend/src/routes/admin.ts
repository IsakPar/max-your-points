import { Router } from 'express';

const router: Router = Router();

// Admin health check
router.get('/health', (req, res) => {
  res.json({ message: 'Admin routes available' });
});

// Admin media route (redirect to main media API)
router.get('/media', (req, res) => {
  // Forward to the main media API
  res.redirect('/api/media');
});

export default router; 
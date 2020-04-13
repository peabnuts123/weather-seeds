import express from 'express';

const router = express.Router();

// @TODO @DEBUG remove
router.get('/test', (req, res) => {
  res.json({ helloWorld: true });
});

export default router;
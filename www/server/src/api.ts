import express from 'express';

import WeatherInfo from '@db/models/WeatherInfo';

const router = express.Router();

router.get('/debug', async (req, res) => {
  let weatherInfoList: WeatherInfo[] = await WeatherInfo.findAll();
  res.json(weatherInfoList);
});

export default router;
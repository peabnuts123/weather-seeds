import crypto from 'crypto';
import express from 'express';
import { MersenneTwister19937, integer, real } from 'random-js';

import WeatherInfo, { WEATHER_TYPE } from '@db/models/WeatherInfo';

const router = express.Router();

router.get('/debug', async (req, res) => {
  let weatherInfoList: WeatherInfo[] = await WeatherInfo.findAll();
  return res.json(weatherInfoList);
});

interface Something {
  seed: string;
}

router.get('/model/:seed', async (req, res) => {
  if (!req.params['seed']) {
    res.statusCode = 400;
    return res.json({
      error: 'Empty or missing seed param',
    });
  }

  let rawModelSeed = req.params['seed'];

  let numValues = Number(req.query['numValues']) || 10;

  let modelSeed = parseInt(
    // Hash model seed and take last 4 bytes
    crypto.createHmac("sha256", rawModelSeed).digest('hex').substring(56),
    // Convert hex string to number (is at most 0xFFFFFFFF because of substring())
    16
  );

  const prng = MersenneTwister19937.seed(modelSeed);
  const weatherTypeValues = Object.values(WEATHER_TYPE);

  // @TODO probably put this somewhere better
  // @TODO research a better way to inform this
  let weatherWeights: Record<WEATHER_TYPE, number> = {
    [WEATHER_TYPE.Snow]: 0.0025,
    [WEATHER_TYPE.Clear]: 0.3325,
    [WEATHER_TYPE.Rain]: 0.3325,
    [WEATHER_TYPE.Cloud]: 0.3325,
  };

  let responseValues: WEATHER_TYPE[] = [];
  for (let i = 0; i < numValues; i++) {
    // Implementing weighted random based on weights table above
    let probabilitySum = 0;
    let randValue = real(0, 1, false)(prng);
    for (let weatherTypeValue of weatherTypeValues) {
      probabilitySum += weatherWeights[weatherTypeValue];
      if (randValue < probabilitySum) {
        responseValues.push(weatherTypeValue);
        break;
      }
    }
  }

  res.json(responseValues);
});

export default router;

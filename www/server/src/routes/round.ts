import express from 'express';

import RoundController from '@app/controllers/round';

const router = express.Router();

/**
 * GET /api/round
 * Get all rounds
 */
router.get('/',
  RoundController.init,
  RoundController.sendAllRounds,
);

/**
 * GET /api/round/active
 * Get the currently active round
 */
router.get('/active',
  RoundController.init,
  RoundController.getActiveRound,
  RoundController.sendRound,
);

/**
 * GET /api/round/1
 * Get a round by id
 */
router.get('/:id',
  RoundController.init,
  RoundController.getRoundById,
  RoundController.sendRound,
);

/**
 * GET /api/round/details/active
 * Get all the predictors, predictions and weather data for the active round
 */
router.get('/details/active',
  RoundController.init,
  RoundController.getActiveRound,
  RoundController.sendRoundDetails,
);

/**
 * GET /api/round/details/1
 * Get all the predictors, predictions and weather data for the given round id
 */
router.get('/details/:id',
  RoundController.init,
  RoundController.getRoundById,
  RoundController.sendRoundDetails,
);

export default router;

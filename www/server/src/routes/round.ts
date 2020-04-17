import express from 'express';

import RoundRepository from '@common/repos/round';
import Round from '@db/models/Round';

const router = express.Router();

/**
 * GET /api/round
 * Get all rounds
 */
router.get('/', async (req, res) => {
  // Whether to include predictors in the response payload
  let includePredictors = Boolean(req.query['predictors']);

  let allRounds: Round[] = await RoundRepository.getAll(includePredictors);
  return res.json(allRounds.map((round) => round.toJSON()));
});

/**
 * GET /api/round/active
 * Get the currently active round
 */
router.get('/active', async (req, res) => {
  try {
    // Whether to include predictors in the response payload
    let includePredictors = Boolean(req.query['predictors']);

    // Look up active round
    let activeRound: Round | null = await RoundRepository.getCurrent(includePredictors);

    // Validate there is an active round
    if (activeRound === null) {
      return res.status(500).json({
        error: "No active rounds",
      });
    }

    // Serialize round payload
    return res.json(activeRound.toJSON());
  } catch (err) {
    // An error occurred looking up active round (e.g. more than 1 active round)
    return res.status(500).json({
      error: err.message,
    });
  }
});

/**
 * GET /api/round/1
 * Get a round by id
 */
router.get('/:id', async (req, res) => {

  // Id of the round to get
  let roundId = Number(req.params['id']);

  // Validate roundId is a number
  if (Number.isNaN(roundId)) {
    return res.status(400).json({
      error: `Route parameter "id" must be a number. Received: ${req.params['id']}`,
    });
  }

  // Whether to include predictors in the response payload
  let includePredictors = Boolean(req.query['predictors']);

  // Lookup round by id
  let round = await RoundRepository.getById(roundId, includePredictors);

  // Ensure a round exists with this id
  if (round === null) {
    return res.status(404).json({
      error: `No route exists with id "${roundId}"`,
    });
  }

  // Serialize payload
  return res.json(round.toJSON());
});

export default router;

import { Request, Response, NextFunction } from "express";

import PredictorRepository from '@common/repos/predictor';
import RoundRepository from '@common/repos/round';
import WeatherInfoRepository from '@common/repos/weather-info';
import Logger from "@common/util/Logger";
import Round from "@db/models/Round";
import WeatherInfo from "@db/models/WeatherInfo";
import Predictor from "@db/models/Predictor";

/**
 * Custom type of Request for RoundController to include custom
 * properties for passing data between middleware
 */
interface RoundRequest extends Request {
  customData: {
    round?: Round;
  };
}

class RoundController {
  /**
   * Setup route for use with the Round Controller
   */
  public async init(req: Request, res: Response, next: NextFunction): Promise<any>;
  public async init(req: RoundRequest, res: Response, next: NextFunction) {
    req.customData = {};

    return next();
  }

  /**
   * Look up the currently active round. Stores the result in `req.customData.round`
   */
  public async getActiveRound(req: Request, res: Response, next: NextFunction): Promise<any>;
  public async getActiveRound(req: RoundRequest, res: Response, next: NextFunction) {
    try {
      // Look up active round
      let activeRound: Round | null = await RoundRepository.getCurrent();

      // Validate there is an active round
      if (activeRound === null) {
        return res.status(500).json({
          error: "No active rounds",
        });
      }

      // Store reference
      req.customData.round = activeRound;

      return next();
    } catch (err) {
      // An error occurred looking up active round (e.g. more than 1 active round)
      return res.status(500).json({
        error: err.message,
      });
    }
  }

  /**
   * Look up a round by id. Looks for a request param called `id` and stores the result
   * on `req.customData.round`
   */
  public async getRoundById(req: Request, res: Response, next: NextFunction): Promise<any>;
  public async getRoundById(req: RoundRequest, res: Response, next: NextFunction) {
    // Id of the round to get
    let roundId = Number(req.params['id']);

    // Validate roundId is a number
    if (Number.isNaN(roundId)) {
      return res.status(400).json({
        error: `Route parameter "id" must be a number. Received: ${req.params['id']}`,
      });
    }

    // Lookup round by id
    let round = await RoundRepository.getById(roundId);

    // Ensure a round exists with this id
    if (round === null) {
      return res.status(404).json({
        error: `No round exists with id "${roundId}"`,
      });
    }

    // Store reference
    req.customData.round = round;

    return next();
  }

  /**
   * Lookup a round's full details and send the response.
   * Expects a round instance to be available on `req.customData.round`
   */
  public async sendRoundDetails(req: Request, res: Response): Promise<any>;
  public async sendRoundDetails(req: RoundRequest, res: Response) {
    let round: Round | undefined = req.customData.round;
    if (!round) {
      Logger.logError(`Can't get Round details - no round available on req.customData.round`);
      return res.sendStatus(500);
    }

    // Weather info
    let weather: WeatherInfo[] = await WeatherInfoRepository.getWeatherForRound(round);

    // Predictors
    let predictors: Predictor[] = await PredictorRepository.getPredictorsForRound(round);

    // Serialize and send
    return res.json({
      round: round.toJSON(),
      // Convert weather objects to JSON
      weather: weather.map((x) => x.toJSON()),
      // Convert predictors to JSON and get predictions
      predictors: predictors.map((predictor) => {
        return Object.assign(predictor.toJSON(), {
          predictions: predictor.getPredictions(weather.length),
        });
      }),
    });
  }


  /**
   * Serialize and send the current round stored on `req.customData.round`
   */
  public async sendRound(req: Request, res: Response): Promise<any>;
  public async sendRound(req: RoundRequest, res: Response) {
    if (req.customData.round) {
      return res.json(req.customData.round.toJSON());
    } else {
      return res.sendStatus(500);
    }
  }

  /**
   * Look up and send all rounds
   */
  public async sendAllRounds(req: Request, res: Response): Promise<any>;
  public async sendAllRounds(req: RoundRequest, res: Response) {
    let allRounds: Round[] = await RoundRepository.getAll();
    return res.json(allRounds.map((round) => round.toJSON()));
  }
}

export default new RoundController();

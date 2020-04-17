import { Op } from "sequelize";

import WeatherInfo from "@db/models/WeatherInfo";
import Round from "@db/models/Round";

class WeatherInfoRepository {
  /**
   * Get all weather info objects for a given round
   * @param round Round for which to get weather info
   */
  public async getWeatherForRound(round: Round): Promise<WeatherInfo[]> {
    return WeatherInfo.findAll({
      where: {
        createdAt: {
          [Op.and]: [
            // CreatedAt is greater than or equal to round start date
            { [Op.gte]: round.startDate },
            // Only filter for endDate if there is one
            round.endDate && { [Op.lte]: round.endDate },
          ].filter(Boolean), // Hack to remove undefined entries from an array
        },
      },
    });
  }
}

export default new WeatherInfoRepository();

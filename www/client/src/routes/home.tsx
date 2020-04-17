import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import RoundStore, { RoundDetails, Round } from "@app/data/store/round";
import { WeatherInfo } from "@app/data/store/weather";
import { PredictorAndPredictions } from "@app/data/store/predictor";

const Home = () => {
  // State
  const [currentRoundDetails, setCurrentRoundDetails] = useState<RoundDetails | null>(null);
  const [isFetchingCurrentRoundDetails, setIsFetchingCurrentRoundDetails] = useState<boolean>(false);

  // Alias
  const currentRound = currentRoundDetails?.round as Round;
  const currentRoundWeather = currentRoundDetails?.weather as WeatherInfo[];
  const currentRoundPredictors = (currentRoundDetails?.predictors as PredictorAndPredictions[]);

  if (currentRoundPredictors) {
    currentRoundPredictors.sort((a, b) => {
      const valA = a.firstIncorrectDate?.valueOf() || Infinity;
      const valB = b.firstIncorrectDate?.valueOf() || Infinity;
      return valB - valA;
    })
  }

  // Fetch current round details immediately
  useEffect(() => {
    (async function () {
      setIsFetchingCurrentRoundDetails(true);

      const roundDetails: RoundDetails = await RoundStore.getCurrentRoundDetails();
      setCurrentRoundDetails(roundDetails);

      setIsFetchingCurrentRoundDetails(false);
    })();
  }, []);

  return (
    <div class="Home">
      <pre>
        <code>@TODO put a better frontend on here</code>
      </pre>
      <h1>Home</h1>


      {isFetchingCurrentRoundDetails && (
        <em>Fetching round details...</em>
      )}

      {!isFetchingCurrentRoundDetails && currentRoundDetails && (
        <div>
          <h2>Current round - {currentRound.id}</h2>

          <h3 class="u-marginTop-lg">Info</h3>
          <div class="u-marginLeft-lg">
            <dl>
              <dt>Started</dt>
              <dd>{currentRound.startDate.toLocaleString()}</dd>
            </dl>
          </div>

          <h3 class="u-marginTop-lg">Actual weather</h3>
          <div className="u-marginLeft-lg">
            <ol>
              {currentRoundWeather.map((weather) => (
                <li key={weather.id}>{weather.type} - {weather.createdAt.toLocaleString()}</li>
              ))}
            </ol>
          </div>

          <h3 class="u-marginTop-lg">Predictors</h3>
          {currentRoundPredictors.map((predictor) => (
            <div key={predictor.id} class="u-marginBottom-lg u-marginLeft-lg">
              <h4>Seed: <code>{predictor.seed}</code>{predictor.firstIncorrectDate ? (<span style="color: red"> - WRONG {predictor.firstIncorrectDate.toLocaleString()}</span>) : (<span style="color: dodgerblue"> - Still Valid</span>)}</h4>
              <h4>Predictions</h4>
              <ol>
                {predictor.predictions.map((prediction, index) => (
                  <li key={index}>{prediction}</li>
                ))}
              </ol>
              <hr />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;

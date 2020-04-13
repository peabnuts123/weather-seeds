import { h } from "preact";
import { useState } from "preact/hooks";

import DebugStore, { WeatherInfo, WeatherType } from '@app/data/store/debug';

const Home = () => {
  // State
  const [fetchingWeatherInfo, setFetchingWeatherInfo] = useState(false);
  const [allWeatherInfo, setAllWeatherInfo] = useState<WeatherInfo[] | undefined>(undefined);
  const [fetchingModelPredictions, setFetchingModelPredictions] = useState(false);
  const [modelInput, setModelInput] = useState('');
  const [modelPredictions, setModelPredictions] = useState<WeatherType[] | undefined>(undefined);
  const [currentDisplayedModelInput, setCurrentDisplayedModelInput] = useState<string | undefined>(undefined);

  // Functions
  const getAllWeatherInfo = async () => {
    if (fetchingWeatherInfo) return;
    setFetchingWeatherInfo(true);
    const allWeatherInfo: WeatherInfo[] = await DebugStore.getAllWeatherInfo();
    setFetchingWeatherInfo(false);
    setAllWeatherInfo(allWeatherInfo);
  };

  const getModelPredictions = async () => {
    if (fetchingModelPredictions) return;
    if (!modelInput) return;
    setFetchingModelPredictions(true);
    const modelPredictions = await DebugStore.getModelPredictions(modelInput);
    setCurrentDisplayedModelInput(modelInput);
    setFetchingModelPredictions(false);
    setModelPredictions(modelPredictions);
  };

  return (
    <div class="Home">
      <h1>Home</h1>

      <div>
        <label>
          Model seed
          <input type="text" class="Input Input--text" onInput={({ target }) => target && setModelInput((target as HTMLInputElement).value as string)} />
        </label>
        <button class="Button" onClick={() => getModelPredictions()} disabled={fetchingModelPredictions}>Get model predictions</button>
      </div>

      {fetchingModelPredictions && (
        <em>Fetching model predictions...</em>
      )}

      {!modelPredictions && !fetchingModelPredictions && (
        <em>Click &quot;Get model predictions&quot; to get predictions by the model defined by the given seed</em>
      )}

      {modelPredictions && !fetchingModelPredictions && (
        <div>
          <p>First {modelPredictions.length} predictions for model: <code>{currentDisplayedModelInput}</code></p>
          <ol>
            {modelPredictions.map((modelPrediction, index) => (
              <li key={index}>{modelPrediction}</li>
            ))}
          </ol>
        </div>
      )}

      <br />

      <div>
        <button class="Button" onClick={() => getAllWeatherInfo()}>Get weather info</button>
      </div>

      {fetchingWeatherInfo && (
        <em>Fetching...</em>
      )}

      {!allWeatherInfo && !fetchingWeatherInfo && (
        <em>Weather info not yet fetched. Click &quot;Get weather info&quot; to fetch.</em>
      )}

      {allWeatherInfo && !fetchingWeatherInfo && (
        <div>
          <h2>Weather Info (actual)</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {allWeatherInfo.map((weatherInfo) => (
                <tr key={weatherInfo.id}>
                  <td>{weatherInfo.id}</td>
                  <td>{weatherInfo.type}</td>
                  <td>{weatherInfo.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;

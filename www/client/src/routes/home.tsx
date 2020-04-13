import { h } from "preact";
import { useState } from "preact/hooks";

const Home = () => {
  // State
  const [clickedCount, setClickedCount] = useState<number>(0);

  return (
    <div class="Home">
      <h1>Home</h1>

      <button class="Button" onClick={() => setClickedCount(clickedCount + 1)}>Click me</button>
      <pre><code>You have clicked the button {clickedCount} times</code></pre>
    </div>
  );
};

export default Home;

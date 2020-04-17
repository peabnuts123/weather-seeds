import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Home from "@app/routes/home";
import Debug from "@app/routes/debug";
import NotFound from "@app/routes/not-found";
import Header from "@app/components/header";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
  require("preact/debug");
}

const App: FunctionalComponent = () => {
  return (
    <div id="app">
      <Header />

      <Router>
        <Route path="/" component={Home} />
        <Route path="/debug" component={Debug} />
        <Route default={true} component={NotFound} />
      </Router>
    </div>
  );
};

export default App;

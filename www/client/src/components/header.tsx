import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";

const Header: FunctionalComponent = () => {
  return (
    <header class="Header">
      <h1>Weather Seeds</h1>

      <nav>
        <Link activeClassName="active" href="/">Home</Link>
        <Link activeClassName="active" href="/about">About</Link>
        <Link activeClassName="active" href="/limes">Limes</Link>
      </nav>
    </header>
  );
};

export default Header;

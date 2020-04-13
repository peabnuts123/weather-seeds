import { h } from "preact";
import { Link } from "preact-router/match";

const Header = () => {
  return (
    <header class="Header">
      <h1>Weather Seeds</h1>

      <nav>
        <Link activeClassName="active" href="/">Home</Link>
      </nav>
    </header>
  );
};

export default Header;

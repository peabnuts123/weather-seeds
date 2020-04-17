import { h } from "preact";
import { Link } from "preact-router/match";

const Header = () => {
  return (
    <header class="Header">
      <h1><Link activeClassName="active" href="/">Weather Seeds</Link></h1>

      <nav>
        <Link activeClassName="active" href="/">Home</Link>
        <Link activeClassName="active" href="/debug">Debug</Link>
      </nav>
    </header>
  );
};

export default Header;

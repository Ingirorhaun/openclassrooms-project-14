import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h1>HRnet</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/employee-list">Current Employees</Link>
      </nav>
    </header>
  );
}

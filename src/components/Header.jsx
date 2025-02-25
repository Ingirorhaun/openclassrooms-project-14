import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h1>HRnet</h1>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/employee-list"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Current Employees
        </NavLink>
      </nav>
    </header>
  );
}

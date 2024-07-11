import { Outlet, Link } from "react-router-dom";

const Nav = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/pedidos">Pedidos</Link>
          </li>
          <li>
            <Link to="/catalogo">Catalogo</Link>
          </li>
          <li>
            <Link to="/sobre-nosotros">Sobre Nosotros</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Nav;
import { Outlet, Link } from "react-router-dom";
import imageLeft from '../../resources/images/logo1.gif';
import imageRight from '../../resources/images/logo2.gif';
import { Segment } from 'semantic-ui-react';
import './nav.scss';

const Nav = () => {
  return (
    <>
      <header>
        <img className="f-left" alt="image left" src={imageLeft} />
        <img className="f-right" alt="image right" src={imageRight} />
        <Segment className="header-left">
          <h2>D'Chicos</h2>
          <h3>Siempre pensando en los niños</h3>
        </Segment>
        <Segment className="header-right">
          <h2>Llamanos 4080-2568</h2>
        </Segment>
      </header>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/pedidos">Pedidos</Link>
          </li>
          <li>
            <Link to="/catalogo">Categorias</Link>
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
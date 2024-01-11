/** @jsxImportSource @emotion/react */
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useLoginContext } from './LoggedInContext';

function Header() {
  const { loggedIn } = useLoginContext();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <Link className="TrojanBrand PacificaCR text-dark fs-2" to="/">
            ELECTRIC TROJAN
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse text-start"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <Link className="nav-link normal-font" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link normal-font" to="/Albums">
                  Albums
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle normal-font"
                  id="navbarDropdown"
                  href="thingfish"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Shop
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item normal-font" href="#!">
                      All Products
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item normal-font" href="#!">
                      Popular Items
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item normal-font" href="#!">
                      New Arrivals
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="d-flex">
              <button className="btn btn-outline-dark" type="submit">
                <Icon.Cart className="mb-1" />
                <span className="badge bg-dark text-white ms-2 rounded-pill">
                  12
                </span>
              </button>
              <Link className="normal-font mx-2" to="/Login">
                <button className="btn btn-info btn-login" type="submit">
                  <span className="badge ">
                    {loggedIn ? 'LOGGED IN' : 'LOGIN'}
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;

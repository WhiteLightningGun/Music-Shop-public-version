/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useLoginContext } from './LoggedInContext';
import CartModal from './CartModal';

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
            </ul>
            <div className="d-flex">
              <CartModal />
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

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

function FooterTemplate() {
  function getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }
  return (
    <>
      <footer className="py-4 bg-dark">
        <div className="container">
          <p className="m-0 text-center text-light normal-font ">
            Copyright &copy; Electric Trojan {getCurrentYear()}
          </p>
        </div>
      </footer>
    </>
  );
}

export default FooterTemplate;

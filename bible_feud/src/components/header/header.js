import React from 'react';
import {Link} from 'react-router-dom';

export default function Header(){

    return(
        <header>
        <nav id="main" aria-label="Main">
          <Link to="/">Home</Link> <Link to="" disabled>Language</Link> <Link to="">Login</Link> <Link to="">Play</Link>
        </nav>
      </header>
    );
}
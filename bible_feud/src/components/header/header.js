import React from 'react';
import {Link} from 'react-router-dom';

export default function Header(){

    return(
        <header>
        <nav id="main" aria-label="Main">
          <Link to="/">Home</Link> <Link disabled>Language</Link> <Link>Login</Link> <Link>Play</Link>
        </nav>
      </header>
    );
}
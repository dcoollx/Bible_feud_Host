import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import './App.css';

//components
import Waiting from './components/lobby/waiting';
import RoomCode from './components/lobby/RoomCode';
import Game from './components/game/game';

function App() {
  return (
    <Router>
    <div className="App">
      <header>
        <nav aria-label="Main">
          <Link to="/">Home</Link>
          <Link>about</Link>
          <Link>login</Link>
        </nav>
      </header>
      <main>
         <Switch>
           <Route exact path="/">
              <h1>Bible Feud</h1>
              <div>
                <button><Link to="/waiting">Host a game</Link></button>
                <button>Join A game</button>
              </div>
            </Route>
            <Route exact path="/waiting">
              <RoomCode/>
              <Waiting/>
            </Route>
            <Route exact path="/game">
              <Game/>
            </Route>
          </Switch>
      </main>
      
  
      <footer>
        <p>Terms and conditions</p>
      </footer>
    </div>
    </Router>
  );
}

export default App;

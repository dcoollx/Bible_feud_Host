import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//components
import Home from './components/home/home';
import Waiting from './components/lobby/waiting';
import Game from './components/game/game';

class App extends React.Component {
  state = {
    conn :null,
    room : {roomCode : null, players : [{name:'jordan'}]},
    host:false
  }
  updateRoomCode = (roomCode, callback)=>{
    let room = {...this.state.room};
    room.roomCode = roomCode;
    this.setState({room},callback);
  }
  toggleHost = (bool,callback=null)=>{
    if(callback){
      this.setState({host:bool},callback);
    }else{
      this.setState({host:bool});
    }
  }
  
  componentDidMount(){
    let conn = io('http://localhost:8000/games');
    this.setState({conn});
    //todo set up disconnection event
    //conn.on('disconnect',()=>{});
  }

  render(props){
  return (
    <Router>
    <div className="App">
      <header>
        <nav id="main" aria-label="Main">
          <Link to="/">Home </Link>
          <Link>Language </Link>
          <Link>Login </Link>
          <Link>Play</Link>
        </nav>
      </header>
      <main className="container">
         <Switch>
           <Route exact path="/" >
           <Home toggleHost={this.toggleHost} connect = {this.connectToSoc} conn={this.state.conn} updateRoom = {this.updateRoomCode}/>
           </Route>
            <Route exact path="/waiting">
              <Waiting host={this.state.host} conn = {this.state.conn} room = {this.state.room} updateRoom = {this.updateRoomCode}/>
              </Route>
            <Route exact path="/game">
              <Game conn = {this.state.conn}/>
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
}
export default App;

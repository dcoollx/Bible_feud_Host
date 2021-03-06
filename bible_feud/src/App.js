import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import './styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import dotenv from 'dotenv';

//components
import Header from './components/header/header';
import Home from './components/home/home';
import Waiting from './components/lobby/waiting';
import Game from './components/game/game';

class App extends React.Component {
  state = {
    conn :null,
    room : {roomCode : null, players : []},
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
    if(this.state.conn){
      this.state.conn.emit('leave');
    }else{
    let url = process.env.REACT_APP_URL || 'localhost:8000/';
    //https://bible-fued-server.herokuapp.com/
    console.log(url);
    let conn = io(url + 'games');
    this.setState({conn});
    }
    //todo set up disconnection event
    //conn.on('disconnect',()=>{});
  }

  render(props){
  return (
    <Router>
    <div className="App">
      <Header/>
      <main >
         <Switch>
           <Route exact path="/" >
           <Home toggleHost={this.toggleHost} connect = {this.connectToSoc} conn={this.state.conn} updateRoom = {this.updateRoomCode}/>
           </Route>
            <Route exact path="/waiting">
              <Waiting host={this.state.host} conn = {this.state.conn} room = {this.state.room} updateRoom = {this.updateRoomCode}/>
              </Route>
            <Route exact path="/game">
              <Game conn = {this.state.conn} host={this.state.host}/>
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

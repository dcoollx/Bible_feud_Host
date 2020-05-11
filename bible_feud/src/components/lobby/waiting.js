import React from 'react';
import {Link} from 'react-router-dom'; 
import io from 'socket.io-client';

export default class Waiting extends React.Component{
   state = {
     room : {roomCode : null, players : [{name:'jordan'}]},
     host : true,
    }
  componentDidMount(){
    let socket = io.connect('http://localhost:8000/games');
    this.setState({socket});
      //TODO, need to check if this user has already reserved a room 
      //and not request a new from everytime


      //todo create a poll that checks number of players in a room
        //connect to server
    if(this.state.host){
      //let roomCode = hri.random();
    socket.emit('create');
    socket.on('newRoom',(roomCode)=>{
    let room = {...this.state.room}
    room.roomCode = roomCode.roomCode;
    this.setState({room},()=>{
      socket.emit('join',{roomCode : this.state.room.roomCode});
      });
    });
    }else{//not host
      socket.emit('join',{roomCode : this.state.room.roomCode});
    }
    
  }
  componentWillUnmount(){
    this.state.socket.close();
  }
  startGame(){
    if(this.state.socket){
      this.state.socket.broadcast.in(this.state.room.roomCode).emit('startGame');
    }

  }
  render(){
    let list = this.state.room.players.map((player)=>{
    return (<div className = 'player'>{player.name} has joined</div>);
    });
  return (
    <div id="waiting">
      <p>Your Game Code is: <code>{this.state.room.roomCode}</code></p>
    <h2>Waiting for everyone to join</h2>
    <progress></progress>
    <ul>
      {list}
    </ul>
    <button><Link to="/game">Start Now</Link></button>
    </div>
  );
  }
}
import React from 'react';
import {Link} from 'react-router-dom'; 

export default class Waiting extends React.Component{

  state = {
    room : this.props.room,
  }
  
  componentDidMount(){
      //TODO, need to check if this user has already reserved a room 
      //and not request a new from everytime
    if(!this.props.conn){
      window.location.pathname = '/';
    }

      //todo create a poll that checks number of players in a room
        //connect to server
        console.log(this.props);
    if(this.props.host === true){
    this.props.conn.emit('create');
    this.props.conn.on('newRoom',(roomCode)=>{
      this.props.updateRoom(roomCode.roomCode,()=>{
        this.props.conn.emit('join',{roomCode : this.props.room.roomCode});
      });
    });
    }else{//not host
      this.props.conn.emit('join',{roomCode : this.props.room.roomCode});
    }

    this.props.conn.on('joined',(player)=>{
      let room = this.state.room
      room.players.push(player);
      this.setState({room});

    });
    
  }
  componentWillUnmount(){
    //this.props.conn.close();
  }
  startGame(){
    if(this.props.conn){
      this.props.conn.broadcast.in(this.props.room.roomCode).emit('startGame');
    }

  }
  render(){
    let list = this.state.room.players.map((player,i)=>{
    return (<li key={i} className = 'player'>{player.name} has joined</li>);
    });
  return (
    <div id="waiting">
      <p>Your Game Code is: <code>{this.props.room.roomCode}</code></p>
    <h2>Waiting for everyone to join</h2>
    <progress></progress>
    <ul>
      {list}
    </ul>
    <button onClick={(e)=>{
      this.props.conn.emit('start');
    }}>Start Now</button>
    </div>
  );
  }
}
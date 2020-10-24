import React from 'react';
import {Link, withRouter} from 'react-router-dom'; 

class Waiting extends React.Component{

state = {
  room : this.props.room,
}

componentDidMount(){
    //TODO, need to check if this user has already reserved a room 
    //and not request a new from everytime
    let name = localStorage.getItem('name');

  if(!this.props.conn){
    window.location.pathname = '/';
  }

    //todo create a poll that checks number of players in a room
      //connect to server
      //console.log(this.props);
  if(this.props.host === true){
  this.props.conn.emit('create');
  this.props.conn.on('newRoom',(roomCode)=>{
    this.props.updateRoom(roomCode.roomCode,()=>{
      this.props.conn.emit('join',{roomCode : this.props.room.roomCode, name});
    });
  });
  }else{//not host
    this.props.conn.emit('join',{roomCode : this.props.room.roomCode, name});
  }

  this.props.conn.on('joined',(player)=>{
    let room = this.state.room
    room.players = player;
    this.setState({room});
    console.log('players have updated',player);
    document.getElementsByTagName('title')[0].innerHTML = this.props.room.roomCode;

  });

  this.props.conn.on('start',()=>{
    //todo add count down
    this.props.history.push('/game');
    console.log('starting game');
  });
  
}
componentWillUnmount(){
  console.log('leaving');
  this.props.conn.emit('leave',this.props.host);
  document.getElementsByTagName('title')[0].innerHTML = 'Bible Feud'

}
startGame(){
  if(this.props.conn){
    this.props.conn.broadcast.in(this.props.room.roomCode).emit('startGame');
  }

}
render(){
  let list = this.state.room.players.map((player,i)=>{
  return (<li key={i} className = 'player'>{localStorage.getItem('name') === player.name ? 'You have ' : player.name + ' has '}joined</li>);
  });
return (
  <div id="waiting">
  <p>Your Game Code is: <code>{this.props.room.roomCode}</code>| {this.props.host && <span>HOST</span>}</p>
  <ul aria-live="assertive">
    {list}
  </ul>
   
    <div id="details">
  <h2>Waiting for everyone to join</h2>
  <progress></progress>
  
  <button disabled={!this.props.host} onClick={(e)=>{
    this.props.conn.emit('start');
  }}>Start Now</button>
  </div>
  </div>
);
}
}
export default withRouter(Waiting)
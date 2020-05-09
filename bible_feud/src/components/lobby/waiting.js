import React from 'react';
import {Link} from 'react-router-dom'; 

export default class Waiting extends React.Component{
   state = {
     players : [{name:'jordan'}]
    }
    componentDidMount(){
      //todo create a poll that checks number of players in a room
    }
  render(){
    let list = this.state.players.map((player)=>{
    return (<div className = 'player'>{player.name} has joined</div>);
    });
  return (
    <div id="waiting">
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
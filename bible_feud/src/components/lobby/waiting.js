import React from 'react';

export default class Waiting extends React.Component{
   state = {
     players : []
    }
    componentDidMount(){
      //todo create a poll that checks number of players in a room
    }
  render(){
    let list = this.state.players.map(()=>{
      return (<div className = 'player'></div>);
    });
  return (
    <div id="waiting">
    <h2>Waiting for everyone to join</h2>
    <progress></progress>
    <ul>
      {list}
    </ul>
    </div>
  );
  }
}
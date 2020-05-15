import React from 'react';
import {Link, withRouter} from 'react-router-dom';

class home extends React.Component{
  state = {join:false};
  onJoinClick(){
    this.setState({join : !this.state.join})
    
  }
  hostGame(){
    this.props.toggleHost(true,()=>{
      this.props.history.push('/waiting');
    });
  }
  render(props){
    return (
      <div id="home">
        <div className="jumbotron">
          <div className="row">
            <h1 className="col">Bible Feud</h1>
          </div>
          </div>
          <div className="row">
        <button className="play col">PLAY</button>;
        </div>
        <div className="row">
        <button className="col" onClick={()=>this.hostGame()}>Host a game</button>
        {!this.state.join ? (<button className="col"  onClick={()=>this.onJoinClick()}>Join A game</button>) : (
        <form onSubmit={(e)=>{
          e.preventDefault();
          let roomCode = e.target['roomCode_input'].value;
          this.props.updateRoom(roomCode,()=>{
            this.props.toggleHost(false);
            this.props.history.push('/waiting');
          });
         
          //todo check if code is good
        }}>
        <label>Enter Game Code</label>
        <input id="roomCode_input" name="roomCode_input" placeholder="Room Code"/>
        <button type="submit">Join A game</button>
        </form>)}
        </div>
      </div>
    );
  }
}
export default withRouter(home);
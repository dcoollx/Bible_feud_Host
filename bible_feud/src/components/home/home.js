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
    if(!this.state.join){
    return (
      <div id="home">
        <div className="jumbotron">
          <div className="row">
            <h1>Bible Feud</h1>
          </div>
        <button className="play">PLAY</button>;
        </div>
        <button onClick={()=>this.hostGame()}>Host a game</button>
        <button onClick={()=>this.onJoinClick()}>Join A game</button>
        <Link to='/waiting'>test</Link>
      </div>
    );
    }else{
      return (
      <div id="home">
        <h1>Bible Feud</h1>
        <button>Host a game</button>
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
        </form>
      </div>);
    }
  }
}
export default withRouter(home);
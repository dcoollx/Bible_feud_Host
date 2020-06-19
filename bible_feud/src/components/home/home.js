import React from 'react';
import {Link, withRouter} from 'react-router-dom';

class home extends React.Component{
  state = {join:false, host:false};
  onJoinClick(){
    this.setState({join : true, host:false})
    
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
        <button className="play col">PLAY</button>
        </div>
        <div className="row">
        {this.state.host ? <form onSubmit={(e)=>{
          let name = e.target['name_input'].value;
          localStorage.setItem('name',name);
          this.hostGame();
        }}><label>Name:</label><input type="text" defaultValue={localStorage.getItem('name') || ''} required name="name_input"/><button className="col" type="submit">Host a game</button></form>:<button className="col" onClick={()=>{this.setState({host:true,join:false})}}>Host a game</button>}
        {!this.state.join ? (<button className="col"  onClick={()=>this.onJoinClick()}>Join A game</button>) : (
        <form onSubmit={(e)=>{
          e.preventDefault();
          let roomCode = e.target['roomCode_input'].value;
          let name =  e.target['name_input'].value;
          localStorage.setItem('name',name);
          this.props.updateRoom(roomCode,()=>{
            this.props.toggleHost(false);
            this.props.history.push('/waiting');
          });
         
          //todo check if code is good
        }}>
        <label>Enter Name</label>
        <input type="text" required defaultValue = {localStorage.getItem('name') || ''} name="name_input" placeholder="what should we call you"></input><br/>
        <label>Enter Game Code</label>
        <input id="roomCode_input" required name="roomCode_input" placeholder="Room Code"/>
        <button type="submit">Join A game</button>
        </form>)}
        </div>
      </div>
    );
  }
}
export default withRouter(home);
import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {FaPlayCircle} from 'react-icons/fa';
import $ from 'jquery';

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
          <h1>Bible Feud</h1>
          <div className = "controls">
          <button title="Click ti start a new game, or join a current game" onClick={(e)=>{
            $('#signin').toggleClass('hide');
            $(e.currentTarget).toggleClass('hide');
          }}><FaPlayCircle aria-hidden="true" role="presentation" title="play Bible feud" className="playBtn" size="5em"/><span className="hide">Play</span></button>
          <div id="signin" className="row hide">
          {(this.state.host && this.state.join) ? <button>Play</button> : null}
        {this.state.host ? <form onSubmit={(e)=>{
          let name = e.target['name_input'].value;
          localStorage.setItem('name',name);
          this.hostGame();
        }}><label htmlFor="name_input_host">Name:</label><input id="name_input_host" type="text" defaultValue={localStorage.getItem('name') || ''} required name="name_input"/><button className="col" type="submit">Host</button></form>:<button className="col" onClick={()=>{this.setState({host:true,join:false})}}>Host</button>}
        {!this.state.join ? (<button className="col"  onClick={()=>this.onJoinClick()}>Join</button>) : (
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
        <label htmlFor="name_input_join">Enter Name</label>
        <input id="name_input_join"type="text" required defaultValue = {localStorage.getItem('name') || ''} name="name_input" placeholder="what should we call you"></input>
        <label htmlFor="roomCode_input">Game Code: </label>
        <input id="roomCode_input" required type="text" name="roomCode_input" placeholder="Room Code"/>
        <button type="submit">Join</button>
        </form>)}
        </div>
        </div>
      </div>
      <div className="explaination">
        <h2>How to play</h2>

        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu magna vel metus dictum consectetur. Maecenas fringilla lobortis turpis sit amet tristique. Nam varius leo lorem, in venenatis ipsum varius non. Phasellus blandit pulvinar lectus, a tempor risus dictum quis. Aliquam erat volutpat. Cras eget eros aliquam, semper tellus in, suscipit urna. Nulla iaculis semper magna sed ultrices. Fusce nec ante non nibh sodales dapibus. Praesent et mattis dui. Nulla magna nulla, pellentesque sit amet sapien at, viverra vestibulum nibh. Nullam suscipit gravida convallis. Proin vel dui quam. In sed commodo erat, sed accumsan mi.</p>

      </div>
      </div>
    );
  }
}

export default withRouter(home);
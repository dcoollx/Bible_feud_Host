import React from 'react';
import io from 'socket.io-client';

export default class Game extends React.Component{
  state = {
    timer : {start : Date.now(), tick : {}, clock : '0:00'},
    stage : 'research',
    scoreboard : [],
    bibleSection : 'GEN 1:1 - 2:5',
    questions : [{q:'What was Addam\'s wife named', answers: ['Eve','betty','Harley Quinn','Evellyne']},{q:'This is the second Question', a:'Eve', wrong1 : 'betty',wrong2 : 'Harley Quinn', wrong3 : 'Evellyne'}],
    currentQuestion : 0,
  };
  getQuestion(){


  }
  componentDidMount(){
    //
    this.setState({
    timer : {start : Date.now(), tick : setInterval(()=>{
      let newTimer = {...this.state.timer}
      newTimer.clock = new Date(Date.now() - this.state.timer.start).getSeconds();
      this.setState({timer : newTimer})
    },100)}
  });
  }
  componentWillUnmount(){
    clearInterval(this.state.timer.tick);
  }
  changeStage(stage){
    let timer = {...this.state.timer}
    timer.start = Date.now();
    timer.clock = new Date(Date.now() - this.state.timer.start).getSeconds();
    this.setState({timer, stage});
  }
  render(){
    //this.setState({stageChanged :false});
    if(this.state.stage === 'research'){
      if(this.state.timer.clock >= 15){
          this.changeStage('question')
      }
    return (
    <div id="game">
      <h1>{this.state.timer.clock}</h1>
      <h2>Carefully read: {this.state.bibleSection}</h2>
    </div>);
  }else if(this.state.stage === 'question'){
    if(this.state.timer.clock >= 15 && this.state.questions.length <= this.state.currentQuestion){
      let currentQuestion = this.state.currentQuestion + 1;
      this.setState({currentQuestion});
      //this.changeStage('stage');
  }
    let answers= this.state.questions[this.state.currentQuestion].answers.map((a, i)=>{
    return (<li key={i}><button>{a}</button></li>)
    });
    return (
    <div id="game">
      <h1>{this.state.timer.clock}</h1>
      <h2 className="question">{this.state.questions[this.state.currentQuestion].q}</h2>
      <ul>
        {answers}
      </ul>
    </div>)
    }
  }
}
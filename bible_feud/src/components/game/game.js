import React from 'react';
import Timer from '../../utilities/timer';

export default class Game extends React.Component{
  state = {
    timer : new Timer(),
    currentQuestion :0,
    stage : 'research',
    scoreboard : [],
    bibleSection : 'GEN 1:1 - 2:5',
    questions : [{q:'This is a test question', answers: ['if you see this','Something is ','Not working','properly']}],
    myanswer:null,
    maxTime : 5,
  };
  getQuestion(){
    let options = {};
    let url = process.env.SERVER_URL || 'http://localhost:8000';
    fetch(url + '/questions',options).then(res=>res.ok ? res.json() : Promise.reject(res.json())).then(res=>{
      this.setState({questions : res.questions},()=>{
        this.props.conn.emit('question',this.state.questions);
      });
    });


  }
  componentDidMount(){
    //
  this.props.conn.on('roundStart',(q)=>{
      this.setState({bibleSection : q.bibleSection, timer : q.timer})

  });
  this.props.conn.on('nextQuestion',(q)=>{
      this.setState({question : q.q, timer : q.timer});
    });
  this.props.conn.on('close',()=>{
    //room was closed
    alert('room was closed, redirecting to lobby');
    window.location.pathname = '/';
  });
  if(!this.props.conn){
    window.location.pathname = '/';
  }
  this.setState({
    timer : {start : Date.now(), tick : setInterval(()=>{//TODO server determins start time
      let newTimer = {...this.state.timer}
      newTimer.clock = new Date(Date.now() - this.state.timer.start).getSeconds();
      this.setState({timer : newTimer})
    },100)}
  });
  if(this.props.host){//if ur the host setup
    
  this.getQuestion();
  this.props.conn.emit('nextRound', {bibleSection : this.state.bibleSection});
  //send a question
  }else{

   //
  }
  }
  componentWillUnmount(){
    if(this.props.host){
      this.props.conn.broadcast('close');//if host leaves, close the room
      this.state.timer.destroy();
    }
    clearInterval(this.state.timer.tick);
    console.log('leaving');
    this.props.conn.emit('leave',this.props.host);
  }
  changeStage(stage,maxTime=300){
    //maxTime = 5;//for testing
    this.resetClock();
    this.setState({stage,maxTime});
  }

  render(){
    //this.setState({stageChanged :false});
  if(this.state.stage === 'research'){
    if(this.state.timer){
          //this.changeStage('question',30);
    }

    return (
    <div id="game">
      <h1>{this.state.timer.getClock()}</h1>
      <h2>Carefully read: {this.state.bibleSection}</h2>
    </div>);
  }else if(this.state.stage === 'question'){
  //console.log(this.state.questions[this.state.currentQuestion])
  let answers;
    if(!this.props.host){
      //TODO error handle for if no questions
      answers = this.state.questions[this.state.currentQuestion].answers.map((a, i)=>{
    return (<li key={i}><button data-key = {i} onClick={(e)=>{
      let answer = e.target.getAttribute('data-key');
      this.setState({myanswer : answer},()=>{
        this.props.conn.emit('answer',answer);
      });
    }} disabled = {this.state.myanswer ? true : false}>{a}</button></li>)
    });
  }else{
    answers = this.state.questions[this.state.currentQuestion].answers.map((a, i)=>{
      return (<li key={i} className="answer"><div>{a}</div></li>)
      });
  }
    return (
    <div id="game">
      <h1>{Math.floor((this.state.maxTime - this.state.timer.clock) / 60) + ':'+(this.state.maxTime - this.state.timer.clock < 10 ? '0' : '') +Math.floor((this.state.maxTime - this.state.timer.clock) % 60)}</h1>
    <h2 className="question">{this.state.questions[this.state.currentQuestion].q}</h2>
      <ul>
        {answers}
      </ul>
    </div>)
  }else if(this.state.stage === 'roundEnd'){
    if(this.state.timer.clock >= this.state.maxTime)
    //this.state.scoreboard.map()
    return (<div id="endofround">
      <h1>Well Done. Lets Check the scoreboard</h1>
      <table>
        <thead>
          <th>Player</th>
          <th>Score</th>
        </thead>
        
      </table>
    </div>);
  }
  }
}
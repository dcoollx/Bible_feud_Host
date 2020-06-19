import React from 'react';

export default class Game extends React.Component{
  state = {
    timer : {start : Date.now(), tick : {}, clock : '0:00'},
    stage : 'research',
    scoreboard : [],
    bibleSection : 'GEN 1:1 - 2:5',
    questions : [{q:'What was Addam\'s wife named', answers: ['Eve','betty','Harley Quinn','Evellyne']},{q:'This is the second Question', a:'Eve', wrong1 : 'betty',wrong2 : 'Harley Quinn', wrong3 : 'Evellyne'}],
    currentQuestion : 0,
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

  if(!this.props.conn){
    window.location.pathname = '/';
  }
  if(this.props.host){//if ur the host keep trac of right answer and mix them up
    let answers = {//TODO shuffle answers
   };
  this.getQuestion();
  }
    this.setState({
    timer : {start : Date.now(), tick : setInterval(()=>{
      let newTimer = {...this.state.timer}
      newTimer.clock = new Date(Date.now() - this.state.timer.start).getSeconds();
      this.setState({timer : newTimer})
    },100)}
  });
    this.props.conn.on('questions',(questions)=>{
      console.log('recived questions');
      this.setState({questions})
    });
  }
  componentWillUnmount(){
    clearInterval(this.state.timer.tick);
    console.log('leaving');
    this.props.conn.emit('leave',this.props.host);
  }
  changeStage(stage,maxTime=300){
    //maxTime = 5;//for testing
    this.resetClock();
    this.setState({stage,maxTime});
  }

  resetClock(currentQuestion = null){
    let timer = {...this.state.timer}
    timer.start = Date.now();
    timer.clock = new Date(Date.now() - this.state.timer.start).getSeconds();
    if(currentQuestion)
      this.setState({timer, currentQuestion});
    else
      this.setState({timer});
  }
  render(){
    //this.setState({stageChanged :false});
  if(this.state.stage === 'research'){
      if(this.state.timer.clock >= this.state.maxTime){
          this.changeStage('question',30);
      }
    return (
    <div id="game">
      <h1>{Math.floor((this.state.maxTime - this.state.timer.clock) / 60) + ':' + (this.state.maxTime - this.state.timer.clock < 10 ? '0' : '') + Math.floor((this.state.maxTime - this.state.timer.clock) % 60)}</h1>
      <h2>Carefully read: {this.state.bibleSection}</h2>
    </div>);
  }else if(this.state.stage === 'question'){
  
    if(this.state.timer.clock > this.state.maxTime && this.state.currentQuestion < this.state.questions.length){
      let currentQuestion = this.state.currentQuestion
      currentQuestion++; 
      this.setState({currentQuestion, myanswer:null});
      this.resetClock(currentQuestion);
      //need to reset clock
      if(currentQuestion > this.state.questions.length){
        this.changeStage('round',15);
      }
      //this.props.conn.emit('question',this.state.questions[this.state.currentQuestion])
  }
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
  }else if(this.state.stage === 'round'){
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
import React from 'react';
import timer from '../../utilities/timer';
var verbose = true;
function log(txt){
  if(verbose)
    console.log(txt)
}

export default class Game extends React.Component{
  constructor(props){
    super(props);
    this.stage = 'research';

  }

  state = {
    timer : new timer(),
    currentQuestion :0,
    stage : 'research',
    scoreboard : [{name : 'player_one', score : 0 }],
    bibleSection : 'GEN 1:1 - 2:5',
    questions : [{q:'This is a test question', answers: ['If You','See this','Something is','wrong']}],
    myanswer:null,
    maxTime : 120,
  };
  getQuestion(){
    let options = {};
    let url = process.env.REACT_APP_URL || 'http://localhost:8000';
    fetch(url + '/questions',options).then(res=>res.ok ? res.json() : Promise.reject(res.json())).then(res=>{
      this.setState({questions : res.questions},()=>{
        this.props.conn.emit('question',{questions : this.state.questions});
      });
    });


  }
  
  componentDidMount(){
    //
    var that = this;
    if(!this.props.conn){
      window.location.pathname = '/';
    }
    this.state.timer.startTimer(this);
    //custom events
    document.addEventListener('finished',()=>{
      console.log('timer')
      switch(this.state.stage){
        case 'research' : 
        this.changeStage('question',30);
        break;
        case 'question':
          if((this.state.currentQuestion + 1) % 5 == 0){
            this.changeStage('roundEnd',15)
          }else{
            let q = this.state.currentQuestion;
            q++;
            console.log('current question', q);
            this.setState({currentQuestion : q, myanswer : null});
            document.querySelector('.picked').classList.remove('picked');
          }
          break;
        case 'roundEnd':
          if(this.state.currentQuestion === this.state.questions.length - 1){
            //game is over
            console.log('end of game');
            //this.state.timer.stop();

          }else{
            let q = this.state.currentQuestion;
            q++;
            console.log('current question', q);
            this.setState({currentQuestion : q});
            this.changeStage('question',30)//TODO this should go to research
          }
          break;
        default:
          //TODO get new set of questions
          this.changeStage('research');
          break;
      }

    });
    //
    this.props.conn.on('cancel',()=>{
      alert('host has closed the room');
      window.location.pathname = '/';
    });
  this.props.conn.on('disconnect',()=>{
      alert('server commuication error. redirecting to home');
      window.location.pathname = '/';

    });
    this.props.conn.on('roundStart',(q)=>{
    log('round start');
      this.setState({bibleSection : q.bibleSection});
      //this.state.timer.fromJson(q.timer)

  });
  this.props.conn.on('nextQuestion',(q)=>{
    log('next question')
      this.setState({question : q.q});
      //this.state.timer.fromJson(q.timer);
    });
  this.props.conn.on('close',()=>{
    log('closed')
    //room was closed
    alert('room was closed, redirecting to lobby');
    window.location.pathname = '/';
  });
  if(this.props.host){//if ur the host setup
    
  this.getQuestion();
  //this.props.conn.emit('question', {questions : this.state.questions});
  this.props.conn.emit('nextRound', {bibleSection : this.state.bibleSection});
  console.log('sent questions');
  }else{
    this.props.conn.on('questions',function(q){
      console.log('reviced' + q.questions.length + 'questions');
      console.log(this.state);
      that.setState({questions : q.questions});
    })

   //
  }
 // this.setState({timer :new timer()})
  }
  componentWillUnmount(){
    if(this.props.host){
      this.props.conn.emit('close');//if host leaves, close the room
      this.state.timer.destroy();
    }
    this.state.timer.destroy();
    console.log('leaving');
    this.props.conn.emit('leave',this.props.host);
  }
  changeStage(stage,maxTime=300){
    //maxTime = 5;//for testing
    //this.state.timer.reset();
    this.stage = stage;
    this.state.timer.setMaxTime(maxTime);
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
  if(this.stage === 'research'){
////////////////////////////////////////////////////////////RESEARCH
    return (
    <div id="game">
      <h1>{this.state.timer.output}</h1>
      <h2 id="source">Carefully read: {this.state.bibleSection}</h2>
    </div>);

    ///////////////////////////////////////////////////////Question
  }else if(this.stage === 'question'){
  let answers;
    if(!this.props.host){
      //TODO error handle for if no questions
      answers = this.state.questions[this.state.currentQuestion].answers.map((a, i)=>{
    return (<button key={i} className={"answer"} data-key = {i} onClick={(e)=>{
      let answer = e.target.getAttribute('data-key');
      e.target.classList.add('picked');
      this.setState({myanswer : answer},()=>{
        this.props.conn.emit('answer',answer);
      });
    }} disabled = {this.state.myanswer ? true : false}>{a}</button>)
    });
  }else{
    answers = this.state.questions[this.state.currentQuestion].answers.map((a, i)=>{
      return (<li key={i} className="answer"><div>{a}</div></li>)
      });
  }
    return (
    <div id="game">
      <h1>{this.state.timer.output}</h1>
    <h2 id="question">{this.state.questions[this.state.currentQuestion].q}</h2>
      <ul id="answers">
        {answers}
      </ul>
    </div>)
  }else if(this.state.stage === 'roundEnd'){
    let scoreboard = this.state.scoreboard.map((player)=>{
      return(
        <tr>
          <td>{player.name}</td>
          <td>{player.score}</td>
        </tr>
      );
    });
   
    return (<div id="endofround">
      <h1>Well Done. Lets Check the scoreboard</h1>
      <table>
        <thead>
          <th>Player</th>
          <th>Score</th>
        </thead>
        <tbody>
          {scoreboard}
        </tbody>
        
      </table>
    </div>);
  }
  }
}
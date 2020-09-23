export default class timer{

    constructor(maxTime = 5){
        this.maxTime = maxTime;
        this.start = Date.now();
        this.output = this.maxTime/60;
        this.clock = 0;
        this.complete = false;
        this.event = new Event('finished');
    }
    startTimer = (state) =>{
        this.tick = setInterval(()=>{
            this.clock = (Date.now() - this.start) / 1000
            this.output = this.getClock()
            state.setState({clock:this.clock})
            if(this.clock >= this.maxTime){
                this.complete = true;
                document.dispatchEvent(this.event)
                this.reset()
            }
        },1000);

    }
    setMaxTime(t){
        this.maxTime = t;
    }
    fromJson(obj){
        this.maxTime = obj.maxTime;
        this.start = obj.start;
        this.clock = obj.clock;
        
    }
    toJson(){

        var clock = {maxTime : this.maxTime, start : this.start};
        return clock;
    }
    reset(){
        this.start = Date.now();
        this.clock = 0;
        this.complete = false;
    }
    getClock(){
        return Math.floor((this.maxTime - this.clock) / 60) + ':' + (this.maxTime - this.clock < 10 ? '0' : '') + Math.floor((this.maxTime - this.clock) % 60)
    }

    destroy(){
        clearInterval(this.tick);
    }

}
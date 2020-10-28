export default class timer{

    constructor(maxTime =10){
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
        },500);

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
        let clock = {minute:'00',second:'00', get:()=>{
            return this.minute + ':' + this.second
        }}
        clock.minute = Math.floor((this.maxTime - this.clock) / 60) 
        clock.second =  Math.floor((this.maxTime - this.clock) % 60);
        clock.second = clock.second < 10 ? '0'+ clock.second : clock.second;
        clock.minute = clock.minute < 10 ? '0'+ clock.minute : clock.minute;
        clock.second = clock.second < 1 ? '0'+ clock.second : clock.second;
        clock.minute = clock.minute < 1 ? '0' : clock.minute;
        return clock.minute + ':' + clock.second;
    }

    destroy(){
        clearInterval(this.tick);
    }

}
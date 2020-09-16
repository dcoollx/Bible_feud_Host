export default class timer{

    constructor(maxTime = 60){
        this.maxTime = maxTime;
        this.start = Date.now();
        this.tick = setInterval(function(){
            this.clock = this.start - Date.now();
        });
    }
    setMaxTime(t){
        this.maxTime = t;
    }
    fromJson(obj){

        
    }
    toJson(){

        var clock = {maxTime : this.maxTime, start : this.start};
        return clock;
    }
    reset(){
        this.start = Date.now();
    }
    getClock(){
        return Math.floor((this.maxTime - this.clock) / 60) + ':' + (this.maxTime - this.clock < 10 ? '0' : '') + Math.floor((this.maxTime - this.clock) % 60)
    }
    destroy(){
        clearInterval(this.tick);
    }

}
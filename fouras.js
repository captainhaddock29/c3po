var csv = require('csv-parser');
var fs = require('fs');

  
module.exports.FourasGame = class {

    constructor(rtm){
        this.playing = false;
        this.channel = "";
        this.rtm = rtm;
        this.scores = [];
    }
    

    startGame(channel){
        this.channel = channel;
        this.playing = true;
        //console.log(questionResponse[0]);
        this.rtm.sendMessage("Et c'est parti !", this.channel);
        this.askQuestion();   
    }

    askQuestion(){
        let question = this.getQuestions();
        this.questionResponse = question.split(";");
        this.rtm.sendMessage(this.questionResponse[0],this.channel);
    }

    getChannel(){
        return this.channel;
    }

    isPlaying(){
        return this.playing;
    }

    getQuestions(){
        let index = Math.floor(Math.random() * Math.floor(250));
        let lines = require('fs').readFileSync('./fouras.csv', 'utf-8').split('\n').filter(Boolean);
        return lines[index];
    }

    displayScore(){
        let result = "";
        this.scores.sort(this.compare);
        for (var key in this.scores) {
            result += "<@"+key+"> : "+this.scores[key];
            result += this.scores[key] > 1 ? " pts \n" : " pt \n";
        }
        this.rtm.sendMessage(result,this.channel);
    }

    answer(text, user){
        text = text.toLowerCase().replace(/\s/g, '');
        let response = this.questionResponse[1].toLowerCase().replace(/\s/g, '');
        if(text == response){
            this.rtm.sendMessage("Bravo <@"+user+"> , la bonne réponse était bien"+this.questionResponse[1],this.channel);
            this.scores[user] = user in this.scores ? this.scores[user]+1 : 1;
            this.displayScore();
            this.askQuestion();
        }

    }

    stop(){
        this.rtm.sendMessage("Ok, fini de jouer, allez bosser un peu, bande de feignasses !",this.channel);
        this.rtm.sendMessage("Rappel des scores : ", this.channel);
        this.displayScore();
        this.playing = false;
        this.scores = [];
    }

    giveAnswer(){
        this.rtm.sendMessage("Vous êtes pas très joueurs aujourd'hui. La réponse était : "+this.questionResponse[1],this.channel);
        this.askQuestion();
    }

    compare(a,b) {
        if (a < b)
          return -1;
        if (a > b)
          return 1;
        return 0;
    }


}
  
  

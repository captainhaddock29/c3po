
const  { RTMClient } = require('@slack/client');

const {FourasGame} = require('./fouras.js');

// An access token (from your Slack app or custom integration - usually xoxb)
const token = "";
const identUser = "<@UBX0L7TKM>";

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
rtm.start();

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'CBX1LR6LS';

let game = new FourasGame(rtm);
//game.startGame();



rtm.on('message', (event) => {
  // For structure of `event`, see https://api.slack.com/events/message

  console.dir(event);
  // Skip messages that are from a bot or my own user ID
    if (event.user === rtm.activeUserId)  {
    return;
  }

  /*rtm.sendMessage('TG toi', conversationId)
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);*/

  if("text" in event && "user" in event && "channel" in event){
    if(event.text.includes(identUser) && event.text.includes("père fouras")){
      if(game.isPlaying()){
        rtm.sendMessage('Tu suis ou quoi, <@'+event.user+'> ? Une partie est déjà en cours', event.channel);
      } else {
        game.startGame(event.channel);
      }
    }
    else if(game.isPlaying() && event.text.includes(identUser) && event.text.includes("stop")){
      game.stop();
    }
    else if(game.isPlaying() && event.text.includes(identUser) && event.text.includes("donne la réponse")){
      game.giveAnswer();
    }
    else if(game.isPlaying() && game.getChannel()==event.channel){
      game.answer(event.text, event.user);
    }
  }
  
  

  // Log the message
  console.log(`(channel:${event.channel}) ${event.user} says: ${event.text}`);
});
/*
// The RTM client can send simple string messages
rtm.sendMessage('Hello there', conversationId)
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);

  rtm.on('message', (event) => {
    // For structure of `event`, see https://api.slack.com/events/message
  
    console.dir(event);
    // Skip messages that are from a bot or my own user ID
      if (event.user === rtm.activeUserId)  {
      return;
    }

    
    
  
    // Log the message
    console.log(`(channel:${event.channel}) ${event.user} says: ${event.text}`);
  });*/

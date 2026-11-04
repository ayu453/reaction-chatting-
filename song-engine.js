/* Afterglow 10-second message-to-song engine.
 * Original Web Audio compositions; no external track downloads or chat-text uploads.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root)root.AfterglowSongEngine=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const rules=[
    {id:"romantic",patterns:[/\b(love|miss you|crush|date|romantic|darling|baby|sweetheart)\b/i,/\b(pyar|pyaar|yaad aa|miss kr|miss kar|dil|mohabbat|ishq)\b/i,/❤️|💕|💗|🥰|😘|😍/],chords:[[261.63,329.63,392,493.88],[220,261.63,329.63,392],[174.61,220,261.63,329.63],[196,246.94,293.66,392]],melody:[523.25,493.88,440,392,440,493.88,587.33,523.25,493.88,440,392,329.63,392,440,493.88,523.25],wave:"sine"},
    {id:"comfort",patterns:[/\b(sad|sorry|tired|stress|stressed|rough day|bad day|exhausted|overwhelmed|lonely|crying)\b/i,/\b(udaas|dukhi|thak gya|thak gaya|mood off|tension|pareshan|rona|ro raha|mann nhi|man nahi)\b/i,/😔|😢|😭|🫂|💔/],chords:[[220,261.63,329.63,392],[196,233.08,293.66,349.23],[174.61,220,261.63,329.63],[196,233.08,293.66,349.23]],melody:[440,392,349.23,329.63,349.23,392,440,392,349.23,329.63,293.66,261.63,293.66,329.63,349.23,392],wave:"sine"},
    {id:"celebration",patterns:[/\b(congrats|congratulations|won|winner|victory|passed|pass ho|topper|proud of you|lets go|let's go|party)\b/i,/\b(jeet|jeet gya|jeet gaya|kar dikhaya|pass ho gya|pass ho gaya|topper|badhai|shabash)\b/i,/🏆|🎉|🥳|🔥|💯/],chords:[[261.63,329.63,392,523.25],[293.66,369.99,440,587.33],[329.63,415.3,493.88,659.25],[392,493.88,587.33,783.99]],melody:[523.25,659.25,587.33,523.25,587.33,783.99,659.25,587.33,659.25,783.99,880,783.99,659.25,587.33,523.25,783.99],wave:"triangle"},
    {id:"playful",patterns:[/\b(lol|lmao|haha|hahaha|funny|joke|hilarious| मजाक)\b/i,/\b(hasa|hasi|hans|majak|mazak|pagal|bakwas|mast joke)\b/i,/😂|🤣|😆|😹/],chords:[[293.66,369.99,440,587.33],[261.63,329.63,392,523.25],[329.63,415.3,493.88,659.25],[293.66,369.99,440,587.33]],melody:[587.33,659.25,783.99,659.25,587.33,523.25,587.33,783.99,880,783.99,659.25,587.33,659.25,783.99,659.25,587.33],wave:"triangle"}
  ];
  function classifySong(message){
    const text=String(message||"").trim();
    if(!text)return null;
    const ranked=rules.map((rule,index)=>({rule,index,score:rule.patterns.reduce((n,p)=>n+(p.test(text)?1:0),0)})).filter(x=>x.score).sort((a,b)=>b.score-a.score||a.index-b.index);
    return ranked.length?{id:ranked[0].rule.id,score:ranked[0].score}:null;
  }
  function createPlayer(onStatus){
    let context=null,unlocked=false,pending=null,active=[];
    const say=message=>{if(typeof onStatus==="function")onStatus(message);};
    function clearActive(){
      const now=context?context.currentTime:0;
      active.forEach(node=>{try{node.stop(now+.035);}catch(_){ }});
      active=[];
    }
    function unlock(){
      const Ctx=root.AudioContext||root.webkitAudioContext;
      if(!Ctx){say("Audio isn't supported in this browser");return;}
      if(!context)context=new Ctx();
      if(context.state==="running"){unlocked=true;return;}
      context.resume().then(()=>{
        unlocked=context.state==="running";
        if(unlocked){
          root.document?.removeEventListener("pointerdown",unlock,true);
          root.document?.removeEventListener("keydown",unlock,true);
          say("10-second song moments enabled");
          if(pending){const next=pending;pending=null;play(next);}
        }
      }).catch(()=>say("Tap once to enable 10-sec songs"));
    }
    if(root.document){
      root.document.addEventListener("pointerdown",unlock,true);
      root.document.addEventListener("keydown",unlock,true);
    }
    function tone(frequency,start,duration,wave,volume){
      const oscillator=context.createOscillator(),gain=context.createGain();
      oscillator.type=wave;oscillator.frequency.setValueAtTime(frequency,start);
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime(Math.max(.001,volume),start+.045);
      gain.gain.setValueAtTime(Math.max(.001,volume),Math.max(start+.05,start+duration-.12));
      gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
      oscillator.connect(gain);gain.connect(context.destination);
      oscillator.start(start);oscillator.stop(start+duration+.02);
      active.push(oscillator);
      oscillator.onended=()=>{active=active.filter(x=>x!==oscillator);};
    }
    function play(theme){
      if(!context||!unlocked||context.state!=="running"){pending=theme;say("Tap once to enable 10-sec song moments");return false;}
      clearActive();
      const start=context.currentTime+.06,step=2.5;
      theme.chords.forEach((chord,bar)=>{
        const at=start+bar*step;
        chord.forEach((hz,index)=>tone(hz,at,2.44,"sine",index===0 ? 0.026 : 0.014));
        tone(chord[0]/2,at,2.44,"sine",.045);
      });
      theme.melody.forEach((hz,index)=>{
        const at=start+index*.6;
        tone(hz,at,.43,theme.wave,.047);
      });
      say("♫ "+theme.id+" · 10 seconds");
      return true;
    }
    return Object.freeze({
      unlock,
      playMessage(message){
        const match=classifySong(message);
        if(!match)return false;
        const theme=rules.find(rule=>rule.id===match.id);
        return play(theme);
      },
      stop(){pending=null;if(context)clearActive();},
      isUnlocked:()=>unlocked
    });
  }
  return Object.freeze({classifySong,createPlayer,categories:Object.freeze(rules.map(x=>x.id))});
});

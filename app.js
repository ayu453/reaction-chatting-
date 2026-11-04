const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const profiles = {
  maya:{name:'Maya Chen',initial:'M',avatar:'avatar-maya',status:'Active now',messages:[['in','Maya','okay I have a VERY important question','10:42'],['in','','if we had to leave tonight and start a tiny café somewhere, where are we going?','10:42'],['out','','Somewhere by the sea. No emails. Just coffee and questionable life choices.','10:43'],['in','Maya','THIS. this is SO us 😭','10:44'],['out','','I’m naming it “No Thoughts, Just Toast”','10:44'],['in','Maya','STOP I would actually invest','10:45']]},
  leo:{name:'Leo Martin',initial:'L',avatar:'avatar-leo',status:'Active now',messages:[['in','Leo','bro I finally beat that impossible level','11:02'],['out','','NO WAY. after 47 attempts??','11:03'],['in','Leo','47 is a very specific accusation 😂','11:04']]},
  zoya:{name:'Zoya Khan',initial:'Z',avatar:'avatar-zoya',status:'Active 12 min ago',messages:[['in','Zoya','send me the playlist!!','09:31'],['out','','Making you a dangerously good one.','09:32']]},
  noah:{name:'Noah Williams',initial:'N',avatar:'avatar-noah',status:'Last seen yesterday',messages:[['in','Noah','Movie night this weekend?','Yesterday'],['out','','haha deal','Yesterday']]}
};
let activeId='maya', toastTimer;
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function classify(text){ return window.AfterglowReactionEngine.classify(text); }
function updateReaction(text){
 const r=classify(text);
 $('#ambientEmoji').textContent=r.emoji; $('#ambientTag').textContent=r.tag; $('#ambientTitle').textContent=r.title; $('#ambientText').textContent=r.text;
 $('#ambientCard').animate([{filter:'brightness(1)'},{filter:'brightness(1.28)'},{filter:'brightness(1)'}],{duration:650});
 const item=document.createElement('div');item.className='feed-item new-feed';
 item.innerHTML='<span class="feed-icon">'+r.emoji+'</span><div><strong>'+escapeHTML(r.feed)+'</strong><small>'+escapeHTML(r.why)+'</small></div><time>now</time>';
 $('#reactionFeed').prepend(item);while($('#reactionFeed').children.length>4)$('#reactionFeed').lastElementChild.remove();
 $('#feedCount').textContent=String($('#reactionFeed').children.length).padStart(2,'0');
}
function renderChat(id){
 activeId=id;const p=profiles[id];$('#chatName').textContent=p.name;$('#chatStatus').textContent=p.status;
 const avatar=$('.header-avatar');avatar.className='avatar header-avatar '+p.avatar;avatar.textContent=p.initial;
 $('#conversation').innerHTML='<div class="date-divider"><span>TODAY</span></div><div class="day-note">This is your space with '+escapeHTML(p.name.split(' ')[0])+' ✨</div>'+p.messages.map((m,i)=>messageHTML(m,i,p)).join('');
 $$('.friend').forEach(b=>b.classList.toggle('active',b.dataset.id===id));$('#conversation').scrollTop=$('#conversation').scrollHeight;
}
function messageHTML(m,i,p){const [dir,sender,body,time]=m;return '<div class="message-row '+(dir==='out'?'sent':'received')+'">'+(dir==='in'?'<div class="avatar tiny-avatar '+p.avatar+'">'+p.initial+'</div>':'')+'<div class="message-stack">'+(sender?'<span class="sender">'+escapeHTML(sender)+'</span>':'')+'<div class="bubble">'+escapeHTML(body)+'</div><time>'+time+(dir==='out'?' <span class="read-check">✓✓</span>':'')+'</time></div></div>';}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2200);}
function addMessage(text,dir='out'){
 const p=profiles[activeId],time=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
 const row=document.createElement('div');row.innerHTML=messageHTML([dir,dir==='in'?p.name:'',text,time],0,p);
 $('#conversation').append(row.firstElementChild);$('#conversation').scrollTop=$('#conversation').scrollHeight;updateReaction(text);
}
$('#messageForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#messageInput'),text=input.value.trim();if(!text)return;addMessage(text);input.value='';input.style.height='auto';});
$('#messageInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#messageForm').requestSubmit();}});
$('#messageInput').addEventListener('input',e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,110)+'px';});
$('#emojiButton').addEventListener('click',()=>{const i=$('#messageInput');i.value+=' 😊';i.focus();});
$$('.friend').forEach(b=>b.addEventListener('click',()=>renderChat(b.dataset.id)));
$('#friendSearch').addEventListener('input',e=>{const q=e.target.value.toLowerCase();$$('.friend').forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q));});
$$('.filter-tab').forEach(b=>b.addEventListener('click',()=>{$$('.filter-tab').forEach(x=>x.classList.toggle('active',x===b));$$('.friend').forEach(x=>x.hidden=b.dataset.filter==='unread'?!x.querySelector('.unread-count'):!x.textContent.toLowerCase().includes($('#friendSearch').value.toLowerCase()));}));
$('#newChat').addEventListener('click',()=>showToast('Friend search is coming in the next build.'));
$('#openSidebar').addEventListener('click',()=>$('.sidebar').classList.add('open'));
$('#closeSidebar').addEventListener('click',()=>$('.sidebar').classList.remove('open'));
$('#conversation').addEventListener('click',()=>$('.sidebar').classList.remove('open'));

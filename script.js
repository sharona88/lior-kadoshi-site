(function(){
  var nav=document.querySelector('.nav'),burger=document.querySelector('.burger'),drawer=document.getElementById('drawer');
  var wa=document.querySelector('.wa-float');
  function onScroll(){nav.classList.toggle('is-solid',window.scrollY>30);wa.classList.toggle('show',window.scrollY>window.innerHeight*0.8)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  function setMenu(open){
    burger.setAttribute('aria-expanded',String(open));
    burger.setAttribute('aria-label',open?'סגירת תפריט':'פתיחת תפריט');
    drawer.classList.toggle('is-open',open);
    drawer.setAttribute('aria-hidden',String(!open));
    document.body.style.overflow=open?'hidden':'';
  }
  burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true')});
  drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
  window.addEventListener('resize',function(){if(window.innerWidth>1080)setMenu(false)});

  // preselect service from CTA
  var sel=document.getElementById('f-type');
  document.querySelectorAll('[data-service]').forEach(function(b){
    b.addEventListener('click',function(){sel.value=b.getAttribute('data-service')});
  });

  // brief form -> WhatsApp
  var form=document.getElementById('brief'),err=document.getElementById('form-err');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=form.name.value.trim(),phone=form.phone.value.trim(),type=sel.value,msg=form.msg.value.trim();
    var bad=[];
    if(!name)bad.push(form.name);
    if(!/^[+\d][\d\s-]{6,}$/.test(phone))bad.push(form.phone);
    if(!type)bad.push(sel);
    [form.name,form.phone,sel].forEach(function(el){el.classList.toggle('invalid',bad.indexOf(el)>-1)});
    if(bad.length){err.hidden=false;bad[0].focus();return}
    err.hidden=true;
    var text='היי ליאור, הגעתי מהאתר ואשמח להצעת מחיר.\n'+
      'שם: '+name+'\nטלפון: '+phone+'\nסוג ההפקה: '+type+(msg?'\nפרטים: '+msg:'');
    var url='https://wa.me/972502776077?text='+encodeURIComponent(text);
    window.__lastWaUrl=url;
    window.open(url,'_blank','noopener');
  });

  // services scroll spotlight
  var svc=document.querySelector('[data-svc]');
  if(svc){
    var blocks=[].slice.call(svc.querySelectorAll('.svc__block'));
    var ticks=[].slice.call(svc.querySelectorAll('.svc__rail a'));
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking=false,lastActive=-1;
    function clamp(v,a,b){return v<a?a:v>b?b:v}
    function frame(){
      ticking=false;
      var vh=window.innerHeight,mid=vh/2,best=-1,bestD=1e9;
      var sr=svc.getBoundingClientRect();
      svc.classList.toggle('rail-on',sr.top<vh*0.45&&sr.bottom>vh*0.55);
      blocks.forEach(function(b,i){
        var r=b.getBoundingClientRect(),c=r.top+r.height/2,off=c-mid;
        var d=Math.abs(off)/(Math.max(r.height,vh*0.5)*0.9);
        var t=clamp(1-d,0,1);t=t*t*(3-2*t);
        if(Math.abs(off)<bestD){bestD=Math.abs(off);best=i}
        if(reduce){b.style.setProperty('--a','1');return}
        b.style.setProperty('--a',t.toFixed(3));
        var o=clamp(off/vh,-1,1);
        b.style.setProperty('--py',(o*-18).toFixed(1)+'px');
        b.style.setProperty('--ta',(o*-46).toFixed(1)+'px');
        b.style.setProperty('--tb',(o*34).toFixed(1)+'px');
      });
      if(best!==lastActive){
        lastActive=best;
        blocks.forEach(function(b,i){b.classList.toggle('is-active',i===best)});
        ticks.forEach(function(a,i){a.classList.toggle('is-on',i===best);if(i===best)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
      }
    }
    function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
    window.addEventListener('scroll',req,{passive:true});
    window.addEventListener('resize',req);
    ticks.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();var b=blocks[i],r=b.getBoundingClientRect();window.scrollTo({top:window.scrollY+r.top-(window.innerHeight-r.height)/2,behavior:reduce?'auto':'smooth'})})});
    frame();
  }

  // reveal on scroll
  if('IntersectionObserver' in window){
    var els=document.querySelectorAll('.head,.split > *,.card,.frame,.gear__item,.steps li,.contact__grid > *,.reel__inner > div');
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){el.classList.add('reveal');io.observe(el)});
  }
})();

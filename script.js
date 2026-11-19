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

  // reveal on scroll
  if('IntersectionObserver' in window){
    var els=document.querySelectorAll('.head,.split > *,.card,.frame,.gear__item,.steps li,.contact__grid > *,.reel__inner > div');
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){el.classList.add('reveal');io.observe(el)});
  }
})();

// DOM helpers
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

// 1) Skill progress bars - animate when visible
const skillSection = qs('#skills');
const progressBars = qsa('.progress-bar');
let skillsAnimated = false;
function animateSkillBars(){
  if(skillsAnimated) return;
  progressBars.forEach(bar => bar.style.width = bar.dataset.width);
  skillsAnimated = true;
}
function checkSkillsView(){
  if(!skillSection) return;
  const r = skillSection.getBoundingClientRect();
  if(r.top < window.innerHeight - 80) animateSkillBars();
}
window.addEventListener('scroll', checkSkillsView);
window.addEventListener('load', checkSkillsView);

// 2) Contact form validation, store in localStorage and redirect
const contactForm = qs('#contactForm');
const formStatus = qs('#formStatus');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = qs('#name')?.value?.trim() || '';
    const email = qs('#email')?.value?.trim() || '';
    const message = qs('#message')?.value?.trim() || '';
    if(!name || !email || !message){
      formStatus.textContent = 'Please fill all fields.';
      formStatus.style.color = 'crimson';
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email)){
      formStatus.textContent = 'Enter a valid email.';
      formStatus.style.color = 'crimson';
      return;
    }
    const payload = {name,email,message,submittedAt: new Date().toISOString()};
    localStorage.setItem('contactData', JSON.stringify(payload));
    formStatus.textContent = 'Saved. Redirecting...';
    formStatus.style.color = 'green';
    setTimeout(()=> window.location.href = 'form-details.html', 600);
  });
}

// 3) Open projects using JS (no <a>)
qsa('.project-card').forEach(card=>{
  card.tabIndex = 0;
  card.addEventListener('click', ()=> {
    const url = card.dataset.link;
    if(url) window.location.href = url;
  });
  card.addEventListener('keypress', e => { if(e.key === 'Enter') card.click(); });
});

// 4) Canvas drawing
const canvas = qs('#myCanvas');
if(canvas && canvas.getContext){
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0,0,320,180);
  g.addColorStop(0,'#ff8899'); g.addColorStop(1,'#ffd1dc');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,320,180);
  ctx.fillStyle = '#fff';
  ctx.font = '18px sans-serif';
  ctx.fillText('Canvas demo', 12, 28);
  ctx.beginPath(); ctx.arc(260, 50, 24, 0, Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fill();
}

// 5) Image slider
let slideIndex = 0;
const slides = qsa('.slide');
function showSlide(i){
  slides.forEach(s => s.classList.remove('active'));
  slides[i].classList.add('active');
}
if(slides.length){
  showSlide(slideIndex);
  qs('#nextBtn').addEventListener('click', ()=> { slideIndex = (slideIndex+1)%slides.length; showSlide(slideIndex); });
  qs('#prevBtn').addEventListener('click', ()=> { slideIndex = (slideIndex-1+slides.length)%slides.length; showSlide(slideIndex); });
}

// 6) Dark / Light toggle (simple: toggles class)
const nextPageBtn = qs('#nextPageBtn');
if(nextPageBtn){
  // Next Page already navigates in earlier version; this one opens form-details
  nextPageBtn.addEventListener('click', ()=> { window.location.href = 'form-details.html'; });
}

// 7) Back-to-top button
const topBtn = qs('#topBtn');
window.addEventListener('scroll', ()=> {
  topBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
topBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

// Footer year auto update
const y = new Date().getFullYear();
document.getElementById('year').textContent = y;

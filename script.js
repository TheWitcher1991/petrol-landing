(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && window.WOW) {
    new window.WOW({ offset: 70, mobile: true, live: false }).init();
  }

  const steps = [
    {
      title: 'Оператор задает движение',
      description: 'Вручную двигает оси робота, показывая нужную траекторию',
      image: 'assets/robot-step-1.png',
      alt: 'Оператор вручную задаёт роботу траекторию покраски',
    },
    {
      title: 'Программа запоминает',
      description: 'Все движения сохраняются в управляющую программу',
      image: 'assets/robot-step-2.png',
      alt: 'Пульт управления с сохранённой программой движения робота',
    },
    {
      title: 'Робот красит сам',
      description: 'Повторяет цикл без оператора — раз за разом, без отклонений',
      image: 'assets/robot-step-3.png',
      alt: 'Робот самостоятельно распыляет краску на деталь',
    },
  ];

  const section = document.querySelector('.how');
  const title = document.querySelector('#step-title');
  const description = document.querySelector('#step-description');
  const image = document.querySelector('#step-image');
  const previous = document.querySelector('.slider-arrow--previous');
  const next = document.querySelector('.slider-arrow--next');
  const dots = [...document.querySelectorAll('.slider-dots button')];
  let activeIndex = 0;

  function showStep(index) {
    activeIndex = (index + steps.length) % steps.length;
    const step = steps[activeIndex];
    section.dataset.step = String(activeIndex);
    title.textContent = step.title;
    description.textContent = step.description;
    image.src = step.image;
    image.alt = step.alt;
    dots.forEach((dot, dotIndex) => {
      if (dotIndex === activeIndex) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    previous.hidden = activeIndex === 0;
    section.classList.remove('is-changing');
    void section.offsetWidth;
    section.classList.add('is-changing');
  }

  previous.addEventListener('click', () => showStep(activeIndex - 1));
  next.addEventListener('click', () => showStep(activeIndex + 1));
  dots.forEach((dot) => dot.addEventListener('click', () => showStep(Number(dot.dataset.index))));
  section.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showStep(activeIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showStep(activeIndex - 1); }
  });

  let touchStartX = null;
  section.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  section.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showStep(activeIndex + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
    nav.classList.toggle('is-open', !isOpen);
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Открыть меню');
      nav.classList.remove('is-open');
    }
  });
})();

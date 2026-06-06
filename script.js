document.addEventListener('DOMContentLoaded', () => {
  const images = [
    'https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk=',
    'https://loveincorporated.blob.core.windows.net/contentimages/gallery/03211459-0607-4d07-8a6c-9966e3820a7d-Mount-Kirkjufell-Iceland.jpg',
    'https://img.magnific.com/free-photo/beautiful-cherry-blossoms-trees-blooming-spring_335224-878.jpg?semt=ais_hybrid&w=740&q=80',
    'https://img.magnific.com/free-photo/cascade-boat-clean-china-natural-rural_1417-1356.jpg',
    'https://loveincorporated.blob.core.windows.net/contentimages/gallery/32a644e7-50ab-4435-9e12-5013eea5382f-crater-lake-maroon-bells-usa.jpg',
    'https://www.shutterstock.com/image-photo/lake-fusine-lago-superiore-di-600nw-2743357853.jpg'
  ];

  createCarousel(images);
});

function createCarousel(images) {
  if (!images || images.length === 0) return;

  const root = document.createElement('section');
  root.className = 'carousel-root';

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  images.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('data-index', index.toString());

    const box = document.createElement('div');
    box.className = 'carousel-image-box';

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Carousel image ${index + 1}`;
    img.draggable = false;

    box.appendChild(img);
    slide.appendChild(box);
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  root.appendChild(viewport);
  document.body.prepend(root);

  injectCarouselStyles();
  enableSwipeNavigation(track, viewport, images.length);
}

function injectCarouselStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .carousel-root {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px 0;
    }

    .carousel-viewport {
      overflow: hidden;
      position: relative;
      touch-action: pan-y;
      user-select: none;
    }

    .carousel-track {
      display: flex;
      transition: transform 0.35s ease;
      will-change: transform;
    }

    .carousel-slide {
      min-width: calc(100% / 3);
      box-sizing: border-box;
      padding: 0 10px;
      flex-shrink: 0;
    }

    .carousel-image-box {
      position: relative;
      width: 100%;
      padding-top: 62.5%;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
      background: #000;
    }

    .carousel-image-box img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    @media (max-width: 840px) {
      .carousel-slide {
        min-width: 50%;
      }
    }

    @media (max-width: 560px) {
      .carousel-slide {
        min-width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
}

function enableSwipeNavigation(track, viewport, totalSlides) {
  const visibleSlides = 3;
  const maxIndex = Math.max(0, totalSlides - visibleSlides);
  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let prevTranslate = 0;
  let currentTranslate = 0;
  let animationFrame = null;

  const updatePosition = () => {
    const slideWidth = viewport.clientWidth / visibleSlides;
    currentTranslate = -currentIndex * slideWidth;
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;
  };

  const clampIndex = () => {
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
  };

  const onPointerDown = (event) => {
    isDragging = true;
    startX = event.clientX;
    prevTranslate = currentTranslate;
    track.style.transition = 'none';
    viewport.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    currentTranslate = prevTranslate + delta;
    track.style.transform = `translateX(${currentTranslate}px)`;
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.35s ease';

    const slideWidth = viewport.clientWidth / visibleSlides;
    const movement = currentTranslate - prevTranslate;

    if (movement < -50 && currentIndex < maxIndex) {
      currentIndex += 1;
    } else if (movement > 50 && currentIndex > 0) {
      currentIndex -= 1;
    }

    clampIndex();
    updatePosition();
  };

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointerleave', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(updatePosition);
  });

  updatePosition();
}

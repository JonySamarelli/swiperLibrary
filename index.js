/**
 * Creates a Swiper instance on the specified element.
 * @param {HTMLElement} element - The element to attach the Swiper to.
 * @param {Object} options - The options for configuring the Swiper behavior.
 *
 * @param {Function} options.leftEvent - The function to be called when the user swipes left.
 *
 * @param {Function} options.rightEvent - The function to be called when the user swipes right.
 *
 * @param {Function} options.topEvent - The function to be called when the user swipes up.
 *
 * @param {Function} options.bottomEvent - The function to be called when the user swipes down.
 *
 * @param {Boolean} options.horizontal - Whether the Swiper should listen for horizontal swipes.
 *
 * @param {Boolean} options.vertical - Whether the Swiper should listen for vertical swipes.
 *
 * @param {Boolean} options.mobileOnly - Whether the Swiper should only listen for swipes on
 * mobile devices.
 *
 * @param {Boolean} options.step - Whether the Swiper should only listen for swipes that are a
 * single step.
 *
 * @returns {void}
 *
 * */

import './index.scss';

let setSwiperContainer;
let isContainerInvalid;
let setOptions;
let setContainerChildrenClass;
let defaltCardAnimation;
let defaultOptions;
let eventHandler;
let optionsInUse;
let coordinates;

export default function Swiper(element, options = {}) {
  const swiperContainer = setSwiperContainer(element);

  if (isContainerInvalid(swiperContainer)) return false;

  if (!setContainerChildrenClass(swiperContainer)) return false;

  optionsInUse = setOptions(options);

  function handleTouchEnd() {
    coordinates.resetCoordinates(false);
    defaultOptions.slideStep = 0;
  }

  function handleMouseUp() {
    coordinates.resetCoordinates(false);
    defaultOptions.slideStep = 0;
  }

  function handleTouchStart(evt) {
    coordinates.xDown = evt.touches[0].clientX;
    coordinates.yDown = evt.touches[0].clientY;
    defaultOptions.slideSpeed = 25;

    if (optionsInUse.slideble) {
      swiperContainer.addEventListener('touchend', handleTouchEnd, false);
    }
  }

  function handleMouseDown(evt) {
    coordinates.xDown = evt.clientX;
    coordinates.yDown = evt.clientY;
    defaultOptions.slideSpeed = 50;

    if (optionsInUse.slideble) {
      swiperContainer.addEventListener('mouseup', handleMouseUp, false);
    }
  }

  function handleTouchMove(evt) {
    if (!coordinates.xDown || !coordinates.yDown) return;
    coordinates.xUp = evt.touches[0].clientX;
    coordinates.yUp = evt.touches[0].clientY;

    eventHandler();
  }

  function handleMouseMove(evt) {
    if (!coordinates.xDown || !coordinates.yDown) return;

    coordinates.xUp = evt.clientX;
    coordinates.yUp = evt.clientY;

    eventHandler();
  }

  swiperContainer.addEventListener('touchstart', handleTouchStart, false);
  swiperContainer.addEventListener('touchmove', handleTouchMove, false);
  swiperContainer.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
    },
    { passive: false },
  );

  if (!optionsInUse.mobileOnly) {
    swiperContainer.addEventListener('mousedown', handleMouseDown, false);
    swiperContainer.addEventListener('mousemove', handleMouseMove, false);
    swiperContainer.addEventListener(
      'mousemove',
      (e) => {
        e.preventDefault();
      },
      { passive: false },
    );
  }

  return () => {
    swiperContainer.removeEventListener('touchstart', handleTouchStart, false);
    swiperContainer.removeEventListener('touchmove', handleTouchMove, false);
    swiperContainer.removeEventListener('touchend', handleTouchEnd, false);
    swiperContainer.removeEventListener('mousedown', handleMouseDown, false);
    swiperContainer.removeEventListener('mousemove', handleMouseMove, false);
    swiperContainer.removeEventListener('mouseup', handleMouseUp, false);
  };
}

defaultOptions = {
  leftEvent: () => defaltCardAnimation.leftEvent(),
  rightEvent: () => defaltCardAnimation.rightEvent(),
  topEvent: () => defaltCardAnimation.topEvent(),
  bottomEvent: () => defaltCardAnimation.bottomEvent(),
  horizontal: true,
  vertical: false,
  mobileOnly: false,
  slideble: false,
  slideStep: 0,
  slideSpeed: 50,
};

coordinates = {
  xDown: null,
  yDown: null,
  xUp: null,
  yUp: null,
  xDiff: () => coordinates.xDown - coordinates.xUp,
  yDiff: () => coordinates.yDown - coordinates.yUp,
  isHorizontal: () => Math.abs(coordinates.xDiff()) > Math.abs(coordinates.yDiff()),
  resetCoordinates: (isHolding = true) => {
    if (isHolding && defaultOptions.slideble) {
      coordinates.xDown = coordinates.xUp;
      coordinates.yDown = coordinates.yUp;
      coordinates.xUp = null;
      coordinates.yUp = null;
      defaultOptions.slideStep = 0;
    } else {
      coordinates.xDown = null;
      coordinates.yDown = null;
      coordinates.xUp = null;
      coordinates.yUp = null;
    }
  },
};

eventHandler = () => {
  if (
    !defaultOptions.slideble
    || (defaultOptions.slideble
      && defaultOptions.slideStep === defaultOptions.slideSpeed)
  ) {
    if (optionsInUse.horizontal && coordinates.isHorizontal()) {
      if (coordinates.xDiff() > 0) {
        if (optionsInUse.leftEvent) optionsInUse.leftEvent();
      } else if (optionsInUse.rightEvent) optionsInUse.rightEvent();
    } else if (optionsInUse.vertical) {
      if (coordinates.yDiff() > 0) {
        if (optionsInUse.topEvent) optionsInUse.topEvent();
      } else if (optionsInUse.bottomEvent) optionsInUse.bottomEvent();
    }

    coordinates.resetCoordinates();
  } else {
    defaultOptions.slideStep += 1;
  }
};

setOptions = (options) => ({ ...defaultOptions, ...options });

setSwiperContainer = (element) => {
  if (Array.isArray(element)) {
    if (element.length === 1 && element[0] instanceof HTMLElement) {
      element[0].classList.add('swiper-container');
      return element[0];
    }
    return element.find((el) => el.classList.contains('swiper-container'));
  }
  if (element instanceof HTMLElement) {
    element.classList.add('swiper-container');
    return element;
  }
  return false;
};

setContainerChildrenClass = (container) => {
  if (container.childElementCount === 0) return false;
  [...container.children].forEach((child, index) => {
    child.classList.add('swiper-slide-item');
    if (index === 0) child.classList.add('swiper-slide-item--active');
    if (index === 1) child.classList.add('swiper-slide-item--next');
    if (index > 1) child.classList.add('swiper-slide-item--hidden-next');
  });
  return true;
};

isContainerInvalid = (container) => !container;

defaltCardAnimation = {
  leftEvent: () => {
    const prev = document.querySelector('.swiper-slide-item--prev');
    const active = document.querySelector('.swiper-slide-item--active');
    const next = document.querySelector('.swiper-slide-item--next');
    const hiddenNext = document.querySelector(
      '.swiper-slide-item--hidden-next',
    );
    if (!next) return;
    if (prev) {
      prev.classList.remove('swiper-slide-item--prev');
      prev.classList.add('swiper-slide-item--hidden-prev');
    }
    active.classList.remove('swiper-slide-item--active');
    active.classList.add('swiper-slide-item--prev');
    next.classList.remove('swiper-slide-item--next');
    next.classList.add('swiper-slide-item--active');
    if (hiddenNext) {
      hiddenNext.classList.remove('swiper-slide-item--hidden-next');
      hiddenNext.classList.add('swiper-slide-item--next');
    }
  },
  rightEvent: () => {
    const hiddenPrevArr = document.querySelectorAll(
      '.swiper-slide-item--hidden-prev',
    );
    const hiddenPrev = hiddenPrevArr[hiddenPrevArr.length - 1];
    const prev = document.querySelector('.swiper-slide-item--prev');
    const active = document.querySelector('.swiper-slide-item--active');
    const next = document.querySelector('.swiper-slide-item--next');
    if (!prev) return;
    if (next) {
      next.classList.remove('swiper-slide-item--next');
      next.classList.add('swiper-slide-item--hidden-next');
    }
    active.classList.remove('swiper-slide-item--active');
    active.classList.add('swiper-slide-item--next');
    prev.classList.remove('swiper-slide-item--prev');
    prev.classList.add('swiper-slide-item--active');
    if (hiddenPrev) {
      hiddenPrev.classList.remove('swiper-slide-item--hidden-prev');
      hiddenPrev.classList.add('swiper-slide-item--prev');
    }
  },
  topEvent: () => {
    defaltCardAnimation.leftEvent();
  },
  bottomEvent: () => {
    defaltCardAnimation.rightEvent();
  },
};

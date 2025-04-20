
var token = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc0MzQwNDIzOSwiaWF0IjoxNzQzNDA0MjM5fQ.Zq9Za-ap5kbXgBezl90lrBOJGTWjVt75n_q6hdo7ADE";
var base_url = "https://core-services-api-e3a0bnafdsdbazb2.westus-01.azurewebsites.net/api";
(function () {
  "use strict";

  /** Init all on DOMContentLoaded **/
  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initNavScrollSpy();
    initAOS();
    initShowMoreButtons();
    initCompensationCalculator();
    initSwiper();
    const path = window.location.pathname.toLowerCase();

    // Only remove preloader if NOT on index or careers pages
    if (!path.includes('referral') && !path.includes('index') && !path.includes('application-confirmation')) {
      removePreloader();
    }
  });
  /** Mobile nav toggle **/
  function initMobileNav() {
    const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
    if (!mobileNavToggleBtn) return;

    mobileNavToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("mobile-nav-active");
      mobileNavToggleBtn.classList.toggle("bi-list");
      mobileNavToggleBtn.classList.toggle("bi-x");
    });

    document.querySelectorAll("#navmenu a").forEach((link) => {
      link.addEventListener("click", function () {
        if (document.body.classList.contains("mobile-nav-active")) {
          mobileNavToggleBtn.click();
        }
      });
    });

    document.querySelectorAll(".navmenu .toggle-dropdown").forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        this.parentNode.classList.toggle("active");
        this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
        e.stopImmediatePropagation();
      });
    });
  }

  /** ScrollSpy on nav **/
  function initNavScrollSpy() {
    const navmenulinks = document.querySelectorAll(".navmenu a");

    function onScrollSpy() {
      navmenulinks.forEach((link) => {
        if (!link.hash) return;
        const section = document.querySelector(link.hash);
        if (!section) return;
        const position = window.scrollY + 200;
        if (
          position >= section.offsetTop &&
          position <= section.offsetTop + section.offsetHeight
        ) {
          document.querySelectorAll(".navmenu a.active").forEach((active) =>
            active.classList.remove("active")
          );
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    window.addEventListener("load", onScrollSpy);
    document.addEventListener("scroll", onScrollSpy);
  }

  /** Animate on scroll (AOS) **/
  function initAOS() {
    window.addEventListener("load", function () {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          offset: 120,
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          mirror: false,
        });
      }
    });
  }

  //swiper
function initSwiper() {
  document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
    let config = JSON.parse(
      swiperElement.querySelector(".swiper-config").innerHTML.trim()
    );

    if (swiperElement.classList.contains("swiper-tab")) {
      initSwiperWithCustomPagination(swiperElement, config);
    } else {
      new Swiper(swiperElement, config);
    }
  });
}


  /** Show More Buttons **/
  function initShowMoreButtons() {
    const showMore1 = document.getElementById("show-more");
    if (showMore1) {
      showMore1.addEventListener("click", () => {
        document.querySelectorAll(".forge-box").forEach((el) =>
          el.classList.toggle("active")
        );
        showMore1.classList.toggle("show");
      });
    }

    const showMore2 = document.getElementById("show-more2");
    if (showMore2) {
      showMore2.addEventListener("click", () => {
        document.querySelectorAll(".league-box").forEach((el) =>
          el.classList.toggle("active")
        );
        showMore2.classList.toggle("show");
      });
    }
  }

  /** Compensation Calculator **/
  function initCompensationCalculator() {
    function calculateTier(units) {
      if (units >= 80) return 'Platinum';
      if (units >= 40) return 'Gold';
      if (units >= 20) return 'Silver';
      return 'Bronze';
    }

    function calculateRate(tier) {
      const base = 170;
      const spiffMap = {
        Bronze: 0,
        Silver: 30,
        Gold: 80,
        Platinum: 105
      };
      return base + (spiffMap[tier] || 0);
    }

    function calculateRecruitBonus(recruits, avgSales, units) {
      if (units < 15) return 0;
      return recruits * avgSales * 20;
    }

    function updateTierRadios(tier) {
      ['bronze', 'silver', 'gold'].forEach(t => {
        const radio = $(`#radio-${t}`);
        if (radio.length) {
          radio.prop('checked', t === tier.toLowerCase());
          radio.prop('disabled', t !== tier.toLowerCase());
        }
      });
    }

    function updateUI() {
      const units = parseInt($('#units').val()) || 0;
      const recruits = parseInt($('#recruits').val()) || 0;
      const avgSales = parseInt($('#avgSales').val()) || 0;

      $('#unitsValue').text(units);
      $('#recruitsValue').text(recruits);
      $('#avgSalesValue').text(avgSales);

      const tier = calculateTier(units);
      const rate = calculateRate(tier);
      updateTierRadios(tier);

      const personalPay = rate * units;
      const recruitBonus = calculateRecruitBonus(recruits, avgSales, units);
      const totalComp = personalPay + recruitBonus;

      $('#personalPay').text(personalPay.toFixed(2));
      $('#totalComp').text(totalComp.toFixed(2));

      const enable = units >= 15;
      $('#recruits, #avgSales').prop('disabled', !enable);
      $('#recruits-btn-min, #recruits-btn-add, #avgSales-btn-min, #avgSales-btn-add').prop('disabled', !enable);
    }

    // Button click handlers
    $('.btn-action-add, .btn-action-min').on('click', function () {
      const id = $(this).attr('id').split('-')[0]; // e.g., units-btn-min => 'units'
      const input = $('#' + id);
      const currentVal = parseInt(input.val()) || 0;
      const step = id === 'avgSales' ? 1 : 1; // Modify if different step needed
      const change = $(this).hasClass('btn-action-add') ? step : -step;
      const newVal = Math.max(parseInt(input.attr('min') || 0), Math.min(parseInt(input.attr('max') || 100), currentVal + change));
      input.val(newVal).trigger('input');
    });

    // Slider input handlers
    $('#units, #recruits, #avgSales').on('input', updateUI);

    updateUI(); 
}





  /** Preloader Removal **/
  function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    }
  }
  gsap.to(".marquee-track", {
    xPercent: -50,
    duration: 8,
    repeat: -1,
    ease: "linear",
  });
  const paths = document.querySelectorAll(".marquee path");

  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 4,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
  const arrowsTopToBottom = Array.from(
    document.querySelectorAll(".down-arrow-a path")
  ).reverse();

  gsap.to(arrowsTopToBottom, {
    opacity: 1,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    stagger: {
      each: 0.2,
      from: "start", // Ensures top to bottom
      repeat: -1,
      yoyo: true,
    },
  });
  const quotes = document.getElementById("quotes");
const typeTarget = document.getElementById("typeTarget");
const revealButton = document.getElementById("afterButton");

const lines = [
  "From rookie to 15-person team lead in 8 months.",
  "--",
  { bold: "Jordan Martinez" },
];

let lineIndex = 0;
let charIndex = 0;
let cursor;

function typeNextChar() {
  const currentLine = lines[lineIndex];
  const isBold = typeof currentLine === "object";

  if (!typeTarget.children[lineIndex]) {
    const lineEl = document.createElement("div");
    lineEl.innerHTML = isBold ? "<strong></strong>" : "";
    typeTarget.appendChild(lineEl);
  }

  const lineEl = typeTarget.children[lineIndex];
  const targetEl = isBold ? lineEl.querySelector("strong") : lineEl;
  const text = isBold ? currentLine.bold : currentLine;

  targetEl.textContent += text[charIndex];
  charIndex++;

  if (charIndex < text.length) {
    setTimeout(typeNextChar, 40);
  } else {
    lineIndex++;
    charIndex = 0;
    if (lineIndex < lines.length) {
      setTimeout(typeNextChar, 400);
    } else {
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          cursor.remove();
        },
      });

      gsap.to(revealButton, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }
}

  // ✅ Observer to trigger entire flow
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.hasAnimated) {
          entry.target.dataset.hasAnimated = "true";

          // Fade in main container
          gsap.to("#logo-animation", {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          });

          // Fade in image
          gsap.to(quotes, {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              typeNextChar(); // Start typing
            },
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
 
  const logoPaths = document.querySelectorAll(".chipr-logo path");
  if(logoPaths.length > 0){
  const tl2 = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
  // 1. Draw strokes
  tl2.to(logoPaths, {
    strokeDashoffset: 0,
    strokeOpacity: 0.2,
    duration: 1,
    stagger: 0.2,
    ease: "power1.inOut",
  });

  // 2. Fill paths with D9D9D9 at 0.3 opacity
  tl2.to(
    logoPaths,
    {
      fillOpacity: 0.2,
      duration: 0.5,
      stagger: 0.2,
      ease: "power1.out",
    },
    "-=1.5"
  );

  // 3. Fade out both stroke and fill
  tl2.to(
    logoPaths,
    {
      fillOpacity: 0,
      strokeOpacity: 0,
      strokeDashoffset: 1000,
      duration: 1,
      stagger: 0.2,
      ease: "power1.inOut",
    },
    "+=0.5"
  );
}
  let logoanimation = document.getElementById("logo-animation")
  if(logoanimation instanceof Element){
    observer.observe(logoanimation);
  }
})();

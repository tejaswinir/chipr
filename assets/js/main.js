// IIFE to encapsulate all logic
(function () {
  "use strict";

  /** Init all on DOMContentLoaded **/
  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initNavScrollSpy();
    initAOS();
    initShowMoreButtons();
    initDatepicker();
    initCompensationCalculator();
    removePreloader();
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

  /** Bootstrap Datepicker **/
  function initDatepicker() {
    if (typeof $ !== "undefined" && $.fn.datepicker) {
      $('#datepicker-inline').datepicker({
        todayHighlight: true,
        format: 'mm/dd/yyyy',
        autoclose: true,
        inline: true
      });
    }
  }

  /** Compensation Calculator **/
  function initCompensationCalculator() {
    if (typeof $ === "undefined") return;

    function calculateTier(units) {
      if (units >= 80) return "Platinum";
      if (units >= 40) return "Gold";
      if (units >= 20) return "Silver";
      return "Bronze";
    }

    function calculateRate(tier) {
      const base = 170;
      const spiffMap = {
        Bronze: 0,
        Silver: 30,
        Gold: 80,
        Platinum: 105,
      };
      return base + (spiffMap[tier] || 0);
    }

    function calculateRecruitBonus(recruits, avgSales, personalUnits) {
      if (personalUnits < 15) return 0;
      return recruits * avgSales * 20;
    }

    function updateDisplay() {
      const personalUnits = Number($('#units').val());
      const numRecruits = personalUnits >= 15 ? Number($('#recruits').val()) : 0;
      const avgSales = personalUnits >= 15 ? Number($('#avgSales').val()) : 0;

      const tier = calculateTier(personalUnits);
      const rate = calculateRate(tier);
      const personalPay = rate * personalUnits;
      const recruitBonus = calculateRecruitBonus(numRecruits, avgSales, personalUnits);
      const totalComp = personalPay + recruitBonus;

      $('#unitsValue').text(personalUnits);
      $('#recruitsValue').text(numRecruits);
      $('#avgSalesValue').text(avgSales);

      $('#tier').text(tier);
      $('#rate').text(rate.toFixed(2));
      $('#personalPay').text(personalPay.toFixed(2));
      $('#recruitBonus').text(recruitBonus.toFixed(2));
      $('#totalComp').text(totalComp.toFixed(2));

      $('#recruits').prop('disabled', personalUnits < 15);
      $('#avgSales').prop('disabled', personalUnits < 15);


      // Enable or disable radio buttons based on tier
      ['Bronze', 'Silver', 'Gold'].forEach(t => {
        let id = `radio-${t.toLowerCase()}`
        const radio = document.getElementById(id);
        if (radio) {
          let isDisabled = t !== tier
          let isChecked = t === tier
          radio.disabled = isDisabled;
          radio.checked = isChecked;
        }
      });

      $('.btn-action-add').off('click').on('click', function () {
        const id = $(this).data('id');
        const input = $('#' + id);
        let value = parseInt(input.val());
        if (value < parseInt(input.attr('max'))) {
          input.val(value + 1).trigger('input');
        }
      });

      $('.btn-action-min').off('click').on('click', function () {
        const id = $(this).data('id');
        const input = $('#' + id);
        let value = parseInt(input.val());
        if (value > parseInt(input.attr('min'))) {
          input.val(value - 1).trigger('input');
        }
      });
    }

    $('#units, #recruits, #avgSales').on('input', updateDisplay);
    updateDisplay();
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
    duration: 20,
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
        const cursor = document.createElement("span");
        cursor.classList.add("cursor");
        cursor.innerHTML = "|";
        typeTarget.appendChild(cursor);

        setTimeout(() => {
          cursor.remove();
          gsap.to(revealButton, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        }, 500);
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
  let logoanimation = document.getElementById("logo-animation")
  if(logoanimation !==  undefined){
  observer.observe(document.getElementById("logo-animation"));
  }
})();

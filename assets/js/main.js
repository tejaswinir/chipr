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
          duration: 600,
          easing: "ease-in-out",
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
})();

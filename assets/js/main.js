/* ============================================================
   TRAVEXA THEME - MAIN JAVASCRIPT
   Author      : Akshar Webtech
   Version     : 1.0.0

   TABLE OF CONTENTS:
   ------------------------------------------------------------
   01. STICKY HEADER SCROLL EFFECT
   02. ACTIVE NAVIGATION HIGHLIGHTER
   03. OFFCANVAS MOBILE NAVIGATION AUTO CLOSE
   04. SEARCH MODAL AUTOFOCUS & KEYBOARD HANDLER
   05. ANIMATE ON SCROLL (AOS) INITIALIZATION
   06. CUSTOM TRAVEXA DATEPICKER WIDGET
   07. CUSTOM SELECT DROPDOWNS (.travexa-custom-select)
   08. GSAP HERO ENTRANCE TIMELINE & FLOATING BADGES
   09. EXPANDING GALLERY TOUCH CLICK HANDLER
   10. TRAVEL STYLES SWIPER CAROUSEL (HOME V1 & V2)
   11. PROMO BANNER LIVE COUNTDOWN TIMERS
   12. HOME V1 & V2 TESTIMONIALS CAROUSEL
   13. DYNAMIC COPYRIGHT YEAR & SCROLL TO TOP BUTTON
   14. SMOOTH SCROLL FOR ANCHOR LINKS
   15. PRICING MONTHLY / ANNUAL SWITCHER & COUNTERS
   16. PRELOADER HIDE LOGIC
   17. COMING SOON PAGE COUNTDOWN TIMER
   18. INDEX-3 ADVENTURE HERO SLIDER, CAROUSEL & TESTIMONIALS
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     1. STICKY HEADER SCROLL EFFECT
    ============================================================ */
  const headers = document.querySelectorAll(".main-header, .tb-header-v2, .adv-main-header, header");
  if (headers.length > 0) {
    const handleHeaderScroll = () => {
      headers.forEach((header) => {
        if (window.scrollY > 40) {
          header.classList.add("is-sticky");
        } else {
          header.classList.remove("is-sticky");
        }
      });
    };
    handleHeaderScroll();
    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  }

  /* ============================================================
     2. ACTIVE NAVIGATION HIGHLIGHTER
     ============================================================ */
  const currentPath = window.location.pathname.split("https://themes.aksharwebtech.com/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link, .offcanvas-nav .nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && (href === currentPath || (currentPath === "" && href === "index.html"))) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ============================================================
     3. OFFCANVAS MOBILE NAVIGATION AUTO CLOSE
     ============================================================ */
  const offcanvasElement = document.getElementById("offcanvasMobileHeader");
  if (offcanvasElement && typeof bootstrap !== "undefined") {
    const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    const mobileNavLinks = offcanvasElement.querySelectorAll("a:not([data-bs-toggle])");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        offcanvasInstance.hide();
      });
    });
  }

  /* ============================================================
     4. SEARCH MODAL AUTOFOCUS & KEYBOARD HANDLER
     ============================================================ */
  const searchModal = document.getElementById("searchModal");
  if (searchModal) {
    searchModal.addEventListener("shown.bs.modal", function () {
      const searchInput = searchModal.querySelector(".search-modal-input");
      if (searchInput) {
        searchInput.focus();
      }
    });
  }

  /* ============================================================
     5. ANIMATE ON SCROLL (AOS) INITIALIZATION
     ============================================================ */
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      once: true,
      offset: 60,
      disableMutationObserver: false,
    });
  }

  /* ============================================================
     6. CUSTOM TRAVEXA DATEPICKER WIDGET
     ============================================================ */
  const travexaDatePickers = document.querySelectorAll(".travexa-date-picker");
  if (travexaDatePickers.length > 0) {
    let activePop = null;
    let activeInput = null;
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const removeActivePop = () => {
      if (activePop) {
        if (activePop._elevatedCol) {
          activePop._elevatedCol.style.zIndex = "";
          activePop._elevatedCol.style.position = "";
        }
        if (activePop._elevatedParent) {
          activePop._elevatedParent.style.zIndex = "";
          activePop._elevatedParent.style.position = "";
        }
        activePop.remove();
        activePop = null;
        activeInput = null;
      }
    };
    document.addEventListener("click", function (e) {
      if (activePop && !activePop.contains(e.target) && !activeInput.contains(e.target)) {
        removeActivePop();
      }
    });
    travexaDatePickers.forEach((input) => {
      input.addEventListener("click", function (e) {
        e.stopPropagation();
        if (activeInput === this) {
          removeActivePop();
          return;
        }
        removeActivePop();
        // Close any open custom selects to prevent overlap
        document.querySelectorAll(".travexa-custom-select.is-open").forEach((cs) => {
          cs.classList.remove("is-open");
          const c = cs.closest('[class*="col-"]');
          if (c) { c.style.zIndex = ""; c.style.position = ""; }
          const b = cs.closest(".booking-col");
          if (b) { b.style.zIndex = ""; }
          cs.style.zIndex = "";
        });
        activeInput = this;
        let parentCol = this.closest(".booking-col") || this.closest(".position-relative") || this.parentElement;
        let colWrapper = this.closest('[class*="col-"]');
        if (parentCol) {
          parentCol.style.position = "relative";
          parentCol.style.zIndex = "999999";
        }
        if (colWrapper) {
          colWrapper.style.position = "relative";
          colWrapper.style.zIndex = "999999";
        }
        const now = new Date();
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let selectedDate = this.dataset.selectedDate ? new Date(this.dataset.selectedDate) : null;
        const pop = document.createElement("div");
        pop.className = "travexa-datepicker-pop";
        if (this.getAttribute("name") === "checkout" || (parentCol && parentCol.classList.contains("col-6") && parentCol.previousElementSibling)) {
          pop.classList.add("pop-right");
        }
        const renderCalendar = (year, month) => {
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const today = new Date();
          let html = `
            <div class="datepicker-header">
              <button type="button" class="datepicker-nav-btn btn-prev-month" aria-label="Previous Month"><i class="fa-solid fa-chevron-left"></i></button>
              <div class="current-month-year">${monthNames[month]} ${year}</div>
              <button type="button" class="datepicker-nav-btn btn-next-month" aria-label="Next Month"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="datepicker-weekdays">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div class="datepicker-days">
          `;
          for (let i = 0; i < firstDay; i++) {
            html += `<span class="datepicker-day is-disabled"></span>`;
          }
          for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            let classes = "datepicker-day";
            if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day) {
              classes += " is-today";
            }
            if (
              selectedDate &&
              selectedDate.getFullYear() === year &&
              selectedDate.getMonth() === month &&
              selectedDate.getDate() === day
            ) {
              classes += " is-selected";
            }
            html += `<span class="${classes}" data-date="${dateStr}" data-day="${day}">${day}</span>`;
          }
          html += `
            </div>
            <div class="datepicker-footer">
              <button type="button" class="btn-clear-date">Clear</button>
              <button type="button" class="btn-today-date">Today</button>
            </div>
          `;
          pop.innerHTML = html;
          pop.querySelector(".btn-prev-month").addEventListener("click", (evt) => {
            evt.stopPropagation();
            currentMonth--;
            if (currentMonth < 0) {
              currentMonth = 11;
              currentYear--;
            }
            renderCalendar(currentYear, currentMonth);
          });
          pop.querySelector(".btn-next-month").addEventListener("click", (evt) => {
            evt.stopPropagation();
            currentMonth++;
            if (currentMonth > 11) {
              currentMonth = 0;
              currentYear++;
            }
            renderCalendar(currentYear, currentMonth);
          });
          pop.querySelectorAll(".datepicker-day:not(.is-disabled)").forEach((dayEl) => {
            dayEl.addEventListener("click", (evt) => {
              evt.stopPropagation();
              const dateVal = dayEl.getAttribute("data-date");
              const parts = dateVal.split("-");
              const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
              const formattedDisplay = dObj.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              input.value = formattedDisplay;
              input.dataset.selectedDate = dateVal;
              removeActivePop();
            });
          });
          pop.querySelector(".btn-clear-date").addEventListener("click", (evt) => {
            evt.stopPropagation();
            input.value = "";
            delete input.dataset.selectedDate;
            removeActivePop();
          });
          pop.querySelector(".btn-today-date").addEventListener("click", (evt) => {
            evt.stopPropagation();
            const tDate = new Date();
            const yearT = tDate.getFullYear();
            const monthT = String(tDate.getMonth() + 1).padStart(2, "0");
            const dayT = String(tDate.getDate()).padStart(2, "0");
            const dateValT = `${yearT}-${monthT}-${dayT}`;
            const formattedT = tDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            input.value = formattedT;
            input.dataset.selectedDate = dateValT;
            removeActivePop();
          });
        };
        pop._elevatedCol = colWrapper;
        pop._elevatedParent = parentCol;
        renderCalendar(currentYear, currentMonth);
        parentCol.appendChild(pop);
        activePop = pop;
      });
    });
  }

  /* ============================================================
     7. CUSTOM SELECT DROPDOWNS (.travexa-custom-select)
     ============================================================ */
  const customSelects = document.querySelectorAll(".travexa-custom-select");
  customSelects.forEach((select) => {
    const trigger = select.querySelector(".select-trigger");
    const options = select.querySelectorAll(".select-option");
    const displayValue = select.querySelector(".select-value");
    const hiddenInput = select.querySelector(".select-input");
    if (!trigger) return;

    const setElevated = (targetSelect, isOpen) => {
      const col = targetSelect.closest('[class*="col-"]');
      const bookingCol = targetSelect.closest(".booking-col");
      if (col) {
        col.style.zIndex = isOpen ? "999999" : "";
        col.style.position = isOpen ? "relative" : "";
      }
      if (bookingCol) {
        bookingCol.style.zIndex = isOpen ? "999999" : "";
      }
      targetSelect.style.zIndex = isOpen ? "999999" : "";
    };

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (typeof removeActivePop === "function") {
        removeActivePop();
      }
      customSelects.forEach((otherSelect) => {
        if (otherSelect !== select) {
          otherSelect.classList.remove("is-open");
          setElevated(otherSelect, false);
        }
      });
      const isOpen = select.classList.toggle("is-open");
      setElevated(select, isOpen);
    });
    options.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.stopPropagation();
        options.forEach((opt) => opt.classList.remove("active"));
        this.classList.add("active");
        const val = this.getAttribute("data-value");
        const text = this.textContent.trim();
        if (displayValue) displayValue.textContent = text;
        if (hiddenInput) hiddenInput.value = val;
        select.classList.remove("is-open");
        setElevated(select, false);
      });
    });
  });
  document.addEventListener("click", function () {
    customSelects.forEach((select) => {
      select.classList.remove("is-open");
      const col = select.closest('[class*="col-"]');
      const bookingCol = select.closest(".booking-col");
      if (col) {
        col.style.zIndex = "";
        col.style.position = "";
      }
      if (bookingCol) {
        bookingCol.style.zIndex = "";
      }
      select.style.zIndex = "";
    });
  });

  /* ============================================================
     8. GSAP HERO ENTRANCE TIMELINE & FLOATING BADGES
     ============================================================ */
  if (typeof gsap !== "undefined" && document.querySelector(".hero-section")) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (document.querySelector(".hero-script-tag")) {
      tl.from(".hero-script-tag", { opacity: 0, y: -25, duration: 0.8, clearProps: "all" });
    }
    if (document.querySelector(".hero-main-heading")) {
      tl.from(".hero-main-heading", { opacity: 0, y: 35, duration: 0.9, clearProps: "all" }, "-=0.5");
    }
    if (document.querySelector(".hero-desc")) {
      tl.from(".hero-desc", { opacity: 0, y: 25, duration: 0.7, clearProps: "all" }, "-=0.5");
    }
    if (document.querySelector(".hero-badge-left")) {
      tl.from(".hero-badge-left", { opacity: 0, x: -50, duration: 0.8, clearProps: "opacity,transform" }, "-=0.6");
    }
    if (document.querySelector(".hero-badge-right")) {
      tl.from(".hero-badge-right", { opacity: 0, x: 50, duration: 0.8, clearProps: "opacity,transform" }, "-=0.7");
    }
    if (document.querySelector(".hero-booking-bar")) {
      tl.from(".hero-booking-bar", { opacity: 0, y: 40, duration: 0.9, clearProps: "all" }, "-=0.5");
    }
    if (document.querySelector(".hero-quick-tags")) {
      tl.from(".hero-quick-tags", { opacity: 0, y: 20, duration: 0.6, clearProps: "all" }, "-=0.4");
    }
    const heroBgVideo = document.querySelector(".hero-bg-video");
    if (heroBgVideo) {
      heroBgVideo.play().catch(() => {});
    }
  }

  /* ============================================================
     9. EXPANDING GALLERY TOUCH & HOVER HANDLER
     ============================================================ */
  const expandPanels = document.querySelectorAll(".expand-panel");
  expandPanels.forEach((panel) => {
    const activatePanel = () => {
      expandPanels.forEach((p) => p.classList.remove("active"));
      panel.classList.add("active");
    };
    panel.addEventListener("click", activatePanel);
    panel.addEventListener("mouseenter", activatePanel);
  });

  /* ============================================================
     10. TRAVEL STYLES SWIPER CAROUSEL
     ============================================================ */
  if (typeof Swiper !== "undefined" && document.querySelector(".travel-style-slider")) {
    const styleSlider = new Swiper(".travel-style-slider", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".style-slider-next",
        prevEl: ".style-slider-prev",
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 4 }
      }
    });
  }

  /* Swiper Slider for Travel Styles V2 (index-2.html) */
  if (typeof Swiper !== "undefined" && document.querySelector(".tb-travel-styles-swiper")) {
    new Swiper(".tb-travel-styles-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      centeredSlides: false,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".tb-styles-next",
        prevEl: ".tb-styles-prev",
      },
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        992: { slidesPerView: 4, spaceBetween: 24 },
        1200: { slidesPerView: 4, spaceBetween: 24 }
      }
    });
  }

  /* ============================================================
     11. PROMO BANNER LIVE COUNTDOWN TIMERS
     ============================================================ */
  const countdownElements = {
    days: document.getElementById("promo-days"),
    hours: document.getElementById("promo-hours"),
    minutes: document.getElementById("promo-minutes"),
    seconds: document.getElementById("promo-seconds")
  };
  if (countdownElements.days) {
    const endDate = new Date().getTime() + (15 * 24 * 60 * 60 * 1000);
    const timer = setInterval(function () {
      const now = new Date().getTime();
      const distance = endDate - now;
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      countdownElements.days.innerText = d.toString().padStart(2, "0");
      countdownElements.hours.innerText = h.toString().padStart(2, "0");
      countdownElements.minutes.innerText = m.toString().padStart(2, "0");
      countdownElements.seconds.innerText = s.toString().padStart(2, "0");
    }, 1000);
  }

  /* Live Countdown Timer for Promo V2 (index-2.html) */
  const pv2Days = document.getElementById("pv2-days");
  if (pv2Days) {
    const endDate = new Date().getTime() + (12 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000) + (45 * 60 * 1000);
    setInterval(function () {
      const now = new Date().getTime();
      const distance = endDate - now;
      if (distance < 0) return;
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      pv2Days.innerText = d.toString().padStart(2, "0");
      const hEl = document.getElementById("pv2-hours");
      const mEl = document.getElementById("pv2-mins");
      const sEl = document.getElementById("pv2-secs");
      if (hEl) hEl.innerText = h.toString().padStart(2, "0");
      if (mEl) mEl.innerText = m.toString().padStart(2, "0");
      if (sEl) sEl.innerText = s.toString().padStart(2, "0");
    }, 1000);
  }

  /* ============================================================
     12. TESTIMONIALS SWIPER CAROUSEL
     ============================================================ */
  if (typeof Swiper !== "undefined" && document.querySelector(".testimonial-slider")) {
    const testimonialSlider = new Swiper(".testimonial-slider", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".testi-slider-next",
        prevEl: ".testi-slider-prev",
      },
      pagination: {
        el: ".testi-pagination",
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      }
    });
  }

  /* Swiper Slider for Testimonials V2 (index-2.html) */
  if (typeof Swiper !== "undefined" && document.querySelector(".tb-testi-v2-swiper")) {
    new Swiper(".tb-testi-v2-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".tb-testi-v2-next",
        prevEl: ".tb-testi-v2-prev",
      },
      breakpoints: {
        576: { slidesPerView: 1, spaceBetween: 24 },
        992: { slidesPerView: 1, spaceBetween: 24 }
      }
    });
  }

  /* ============================================================
     13. DYNAMIC COPYRIGHT YEAR & SCROLL TO TOP
     ============================================================ */
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const scrollTopBtn = document.getElementById("scrollToTopBtn");
  if (scrollTopBtn) {
    const handleScrollTopBtn = () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    };
    handleScrollTopBtn();
    window.addEventListener("scroll", handleScrollTopBtn, { passive: true });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* ============================================================
     14. SMOOTH SCROLL FOR INTERNAL LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  /* ============================================================
     15. PRICING MONTHLY / ANNUAL TOGGLE & COUNTER ANIMATION
    ============================================================ */
  const pricingToggle = document.getElementById("pricingBillingToggle");
  if (pricingToggle) {
    pricingToggle.addEventListener("change", function () {
      const isAnnual = this.checked;
      const priceNumbers = document.querySelectorAll(".pricing-number");

      priceNumbers.forEach((el) => {
        const startVal = parseInt(el.textContent, 10) || 0;
        const targetVal = parseInt(isAnnual ? el.getAttribute("data-annual") : el.getAttribute("data-monthly"), 10);
        const duration = 400; // ms
        const startTime = performance.now();

        function animateNumber(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          // Ease-out quad formula
          const easeProgress = progress * (2 - progress);
          const currentVal = Math.round(startVal + (targetVal - startVal) * easeProgress);

          el.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(animateNumber);
          } else {
            el.textContent = targetVal;
          }
        }

        requestAnimationFrame(animateNumber);
      });

      // Update /mo vs /yr period text
      const periodEls = document.querySelectorAll(".price-period");
      periodEls.forEach((p) => {
        p.textContent = isAnnual ? "/yr" : "/mo";
      });
    });
  }

});

/* ============================================================
   16. PRELOADER HIDE LOGIC
   ============================================================ */
function hideTravexaPreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader && !preloader.classList.contains("loaded")) {
    preloader.classList.add("loaded");
  }
}
window.addEventListener("load", function () {
  setTimeout(hideTravexaPreloader, 300);
});
setTimeout(hideTravexaPreloader, 1500);

/* ============================================================
   17. COMING SOON PAGE COUNTDOWN TIMER
   ============================================================ */
const csDays = document.getElementById("cs-days");
if (csDays) {
  // Set launch date to 30 days from now
  const launchDate = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);

  setInterval(function () {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) return;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    csDays.innerText = d.toString().padStart(2, "0");
    const csHours = document.getElementById("cs-hours");
    const csMins = document.getElementById("cs-mins");
    const csSecs = document.getElementById("cs-secs");
    if (csHours) csHours.innerText = h.toString().padStart(2, "0");
    if (csMins) csMins.innerText = m.toString().padStart(2, "0");
    if (csSecs) csSecs.innerText = s.toString().padStart(2, "0");
  }, 1000);
}

/* ============================================================
   18. INDEX-3 ADVENTURE HERO SLIDER, CAROUSEL & TESTIMONIALS
   ============================================================ */
if (typeof Swiper !== "undefined" && document.querySelector(".adv-hero-slider")) {

  // Function to smoothly scale down the background image of the ACTIVE slide
  function animateAdvSlideImage() {
    const activeSlideImg = document.querySelector('.swiper-slide-active .adv-slide-img');
    if (activeSlideImg && typeof gsap !== "undefined") {
      gsap.fromTo(activeSlideImg,
        { scale: 1.15 },
        { scale: 1, duration: 7, ease: 'power1.out', overwrite: true }
      );
    }
  }

  const advHeroSlider = new Swiper(".adv-hero-slider", {
    slidesPerView: 1,
    effect: "fade", // Smooth cinematic fade between images
    fadeEffect: { crossFade: true },
    speed: 1500,
    loop: true,
    allowTouchMove: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".adv-next",
      prevEl: ".adv-prev",
    },
    on: {
      init: function () {
        animateAdvSlideImage();
      },
      slideChangeTransitionStart: function () {
        animateAdvSlideImage();
      }
    }
  });
}

/* ============================================================
   INDEX-3 CINEMATIC DESTINATIONS CAROUSEL
============================================================ */
if (typeof Swiper !== "undefined" && document.querySelector(".adv-dest-swiper-v3")) {
  const advDestSwiperV3 = new Swiper(".adv-dest-swiper-v3", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 600,
    grabCursor: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: ".adv-dest-next-v3",
      prevEl: ".adv-dest-prev-v3",
    },
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 24 },
      992: { slidesPerView: 3, spaceBetween: 24 },
      1200: { slidesPerView: 4, spaceBetween: 24 }
    }
  });

  const nextBtnV3 = document.querySelector(".adv-dest-next-v3");
  const prevBtnV3 = document.querySelector(".adv-dest-prev-v3");
  if (nextBtnV3) {
    nextBtnV3.onclick = function () {
      advDestSwiperV3.slideNext();
    };
  }
  if (prevBtnV3) {
    prevBtnV3.onclick = function () {
      advDestSwiperV3.slidePrev();
    };
  }
}

/* =============================
   INDEX-3 TESTIMONIALS SWIPER
   ============================= */
if (typeof Swiper !== "undefined" && document.querySelector(".adv-testi-swiper")) {
  new Swiper(".adv-testi-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    speed: 600,
    grabCursor: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".adv-testi-pagination",
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1200: { slidesPerView: 3 }
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 0. VanillaTilt for Project Cards
  // ==========================================
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".project-card"), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      scale: 1.02,
    });
  }

  // ==========================================
  // 1. Preloader Animation
  // ==========================================
  const tl = gsap.timeline();

  // Fade out inner content after 3 seconds
  tl.to(".preloader-content", {
    opacity: 0,
    duration: 0.5,
    delay: 3,
    ease: "power2.inOut",
  })
    // Split screen / upwards wipe
    .to(".preloader", {
      yPercent: -100,
      duration: 1,
      ease: "power4.inOut",
      onComplete: () => {
        document.querySelector(".preloader").style.display = "none";
        initScroll();
        initAnimations();
      },
    });

  // ==========================================
  // 2. Scroll Initialization (Locomotive + ScrollTrigger)
  // ==========================================
  let locoScroll;

  function initScroll() {
    gsap.registerPlugin(ScrollTrigger);

    locoScroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
      multiplier: 1.2,
      class: "is-reveal",
    });

    // Sync main ScrollTrigger with Locomotive Scroll
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.querySelector("[data-scroll-container]").style.transform
        ? "transform"
        : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    // Hide scroll indicator and home chat button on scroll down
    const scrollIndicator = document.querySelector(".scroll-indicator");
    const homeChatBtn = document.querySelector(".home-chat-btn");

    if (scrollIndicator || homeChatBtn) {
      locoScroll.on("scroll", (args) => {
        const elementsToHide = [];
        if (scrollIndicator) elementsToHide.push(scrollIndicator);
        if (homeChatBtn) elementsToHide.push(homeChatBtn);

        if (args.scroll.y > 100) {
          gsap.to(elementsToHide, {
            opacity: 0,
            duration: 0.3,
            pointerEvents: "none",
          });
        } else {
          gsap.to(elementsToHide, {
            opacity: 1,
            duration: 0.3,
            pointerEvents: "all",
          });
        }
      });
    }

    // Update body smooth scroll behavior CSS to let Locomotive handle it
    document.body.style.overflow = "hidden";
  }

  // ==========================================
  // 3. Animations Setup
  // ==========================================
  function initAnimations() {
    // Hero Text Stagger Reveal
    const split = new SplitType(".split-text", { types: "chars" });

    gsap.from(split.chars, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
      ease: "back.out(1.7)",
      delay: 0.2,
      force3D: true,
    });

    // Fade-up elements with target selector
    const fadeElements = document.querySelectorAll(".fade-up");

    fadeElements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        force3D: true,
      });
    });

    // Initialize Typed.js for the hero rotating text
    new Typed(".typed-text", {
      strings: ["Aspiring Web Developer", "Aspiring Full-Stack Developer"],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1500,
      loop: true,
      loopCount: 2, // Stop after 2 loops
      showCursor: false,
    });
  }

  // ==========================================
  // 4. Magnetic Button Micro-interaction
  // ==========================================
  const magneticBtns = document.querySelectorAll(".magnetic-btn");

  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const position = btn.getBoundingClientRect();
      const x = e.pageX - position.left - position.width / 2;
      const y = e.pageY - position.top - position.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(btn.querySelector(".btn-text"), {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
      gsap.to(btn.querySelector(".btn-text"), {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });

  // ==========================================
  // 5. Theme Toggle Logic
  // ==========================================
  const themeBtn = document.getElementById("theme-toggle");
  const body = document.body;

  // Default to dark mode; respect saved preference if one exists
  const currentTheme = localStorage.getItem("theme") || "dark";
  body.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener("click", () => {
    let theme = body.getAttribute("data-theme");
    let newTheme = theme === "dark" ? "light" : "dark";

    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === "light") {
      themeBtn.innerHTML = '<i class="ph ph-moon"></i>';
    } else {
      themeBtn.innerHTML = '<i class="ph ph-sun"></i>';
    }
  }

  // ==========================================
  // 6. Mobile Menu Toggle
  // ==========================================
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    const icon = mobileMenu.classList.contains("active") ? "ph-x" : "ph-list";
    mobileBtn.innerHTML = `<i class="ph ${icon}"></i>`;
  });

  // Close mobile menu on clicking a link
  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      mobileBtn.innerHTML = `<i class="ph ph-list"></i>`;
    });
  });

  // ==========================================
  // 7. Navigation Links Smooth Scroll Override
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (locoScroll && targetEl) {
        locoScroll.scrollTo(targetEl, {
          offset: -50, // Show section more clearly when clicked
        });
      }
    });
  });

  // ==========================================
  // 8. Contact Form Success Toast
  // ==========================================
  const form = document.getElementById("contact-form");
  const toast = document.getElementById("success-toast");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic validation check
      if (form.checkValidity()) {
        // Show toast
        toast.classList.add("show");

        // Reset form
        form.reset();

        // Hide toast after 3 seconds
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      }
    });
  }

  // ==========================================
  // 9. Back to Top Button
  // ==========================================
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      if (locoScroll) {
        locoScroll.scrollTo("top");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // ==========================================
  // 10. Custom Cursor
  // ==========================================
  const dot = document.querySelector(".custom-cursor-dot");
  const circle = document.querySelector(".custom-cursor-circle");

  // Only run cursor on fine pointer devices (desktops)
  if (window.matchMedia("(pointer: fine)").matches) {
    if (dot && circle) {
      document.addEventListener("mousemove", (e) => {
        // Cursor dot follows exactly
        dot.style.left = e.clientX + "px";
        dot.style.top = e.clientY + "px";

        // Cursor circle follows with a small delay
        setTimeout(() => {
          circle.style.left = e.clientX + "px";
          circle.style.top = e.clientY + "px";
        }, 50);
      });

      // Hover effect for interactive elements
      const interactables = document.querySelectorAll(
        "a, button, input, textarea",
      );
      interactables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          circle.classList.add("hover");
        });
        el.addEventListener("mouseleave", () => {
          circle.classList.remove("hover");
        });
      });
    }
  }

  // ==========================================
  // 11. Auto-Animated 3D Background Effect
  // ==========================================
  const bgContainer = document.querySelector(".spline-container");
  if (bgContainer) {
    function animateBg(timestamp) {
      // Use timestamp to create a continuous smooth wave pattern
      // Slower animation by dividing by a larger number
      const time = timestamp / 3000;

      // Calculate rotation using sine and cosine waves for smooth cyclical movement
      // Different frequencies (time vs time * 0.8) create a more organic, less repetitive figure-8 motion
      const rotateX = Math.sin(time) * 5; // Range: -5 to +5 degrees
      const rotateY = Math.cos(time * 0.8) * 8; // Range: -8 to +8 degrees

      // Scale by 1.1 to prevent edges from showing during rotation
      bgContainer.style.transform = `scale(1.1) perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      requestAnimationFrame(animateBg);
    }

    requestAnimationFrame(animateBg);
  }
});

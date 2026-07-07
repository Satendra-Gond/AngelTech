(function () {
    "use strict";

    var header = document.querySelector(".site-header");
    var navToggle = document.querySelector(".navbar-toggler");
    var nav = document.querySelector("#mainNav");
    var scrollTop = document.querySelector(".scroll-top");
    var revealItems = document.querySelectorAll(".reveal");
    var navLinks = document.querySelectorAll(".nav-link[href^='#']");
    var newsletterForm = document.querySelector(".newsletter-form");
    var contactForm = document.querySelector(".contact-form");
    var testimonialSlider = document.querySelector("[data-testimonial-slider]");
    var heroSlider = document.querySelector("[data-hero-slider]");
    var statCounters = document.querySelectorAll("[data-count]");

    function updateChrome() {
        var scrolled = window.scrollY > 24;
        if (header) {
            header.classList.toggle("is-scrolled", scrolled);
        }
        if (scrollTop) {
            scrollTop.classList.toggle("show", window.scrollY > 420);
        }
    }

    function animateCounter(counter) {
        var target = Number(counter.getAttribute("data-count"));
        var duration = 1400;
        var startTime = null;

        function tick(timestamp) {
            var progress;
            var eased;
            var value;

            if (!startTime) {
                startTime = timestamp;
            }

            progress = Math.min((timestamp - startTime) / duration, 1);
            eased = 1 - Math.pow(1 - progress, 3);
            value = Math.round(target * eased);
            counter.textContent = String(value);

            if (progress < 1) {
                window.requestAnimationFrame(tick);
            } else {
                counter.textContent = String(target);
            }
        }

        if (!Number.isFinite(target)) {
            return;
        }

        window.requestAnimationFrame(tick);
    }

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            var isOpen = nav.classList.toggle("show");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("show");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16 });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });

        if (statCounters.length) {
            var counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.7 });

            statCounters.forEach(function (counter) {
                counterObserver.observe(counter);
            });
        }
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
        statCounters.forEach(function (counter) {
            counter.textContent = counter.getAttribute("data-count");
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });
            link.classList.add("active");
        });
    });

    if (scrollTop) {
        scrollTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (event) {
            var email = newsletterForm.querySelector("input[type='email']");
            var message = newsletterForm.querySelector(".newsletter-message");

            event.preventDefault();

            if (!email.checkValidity()) {
                message.textContent = "Please enter a valid email address.";
                email.focus();
                return;
            }

            message.textContent = "Thank you for subscribing.";
            newsletterForm.reset();
        });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            var requiredFields = Array.prototype.slice.call(contactForm.querySelectorAll("[required]"));
            var email = contactForm.querySelector("input[type='email']");
            var phone = contactForm.querySelector("input[name='phone']");
            var message = contactForm.querySelector(".contact-form-message");
            var firstInvalid = null;
            var phonePattern = /^[0-9+\-\s()]{7,20}$/;

            event.preventDefault();

            requiredFields.forEach(function (field) {
                var isValid = field.value.trim() !== "";

                if (field === email) {
                    isValid = field.checkValidity();
                }

                if (field === phone) {
                    isValid = phonePattern.test(field.value.trim());
                }

                field.classList.toggle("is-invalid", !isValid);
                field.setAttribute("aria-invalid", String(!isValid));

                if (!isValid && !firstInvalid) {
                    firstInvalid = field;
                }
            });

            message.classList.remove("is-success");

            if (firstInvalid) {
                message.textContent = "Please fill all required fields with valid details.";
                firstInvalid.focus();
                return;
            }

            message.textContent = "Thank you. Your message is ready to send.";
            message.classList.add("is-success");
            contactForm.reset();
            requiredFields.forEach(function (field) {
                field.classList.remove("is-invalid");
                field.removeAttribute("aria-invalid");
            });
        });
    }

    if (testimonialSlider) {
        var testimonialSlides = Array.prototype.slice.call(testimonialSlider.querySelectorAll(".testimonial-slide"));
        var testimonialDots = testimonialSlider.querySelector(".testimonial-dots");
        var testimonialPrev = testimonialSlider.querySelector("[data-testimonial-prev]");
        var testimonialNext = testimonialSlider.querySelector("[data-testimonial-next]");
        var testimonialIndex = 0;
        var testimonialTimer = null;

        function showTestimonial(index) {
            testimonialIndex = (index + testimonialSlides.length) % testimonialSlides.length;

            testimonialSlides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === testimonialIndex);
            });

            testimonialSlider.querySelectorAll(".testimonial-dot").forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === testimonialIndex);
                dot.setAttribute("aria-selected", String(dotIndex === testimonialIndex));
            });
        }

        function startTestimonialTimer() {
            window.clearInterval(testimonialTimer);
            testimonialTimer = window.setInterval(function () {
                showTestimonial(testimonialIndex + 1);
            }, 6000);
        }

        if (testimonialSlides.length > 1 && testimonialDots) {
            testimonialSlides.forEach(function (slide, slideIndex) {
                var dot = document.createElement("button");
                dot.className = "testimonial-dot";
                dot.type = "button";
                dot.setAttribute("aria-label", "Show testimonial " + (slideIndex + 1));
                dot.setAttribute("aria-selected", String(slideIndex === 0));
                dot.addEventListener("click", function () {
                    showTestimonial(slideIndex);
                    startTestimonialTimer();
                });
                testimonialDots.appendChild(dot);
            });

            testimonialPrev.addEventListener("click", function () {
                showTestimonial(testimonialIndex - 1);
                startTestimonialTimer();
            });

            testimonialNext.addEventListener("click", function () {
                showTestimonial(testimonialIndex + 1);
                startTestimonialTimer();
            });

            showTestimonial(0);
            startTestimonialTimer();
        }
    }

    if (heroSlider) {
        var heroSlides = Array.prototype.slice.call(heroSlider.querySelectorAll(".hero-slide"));
        var heroPrev = heroSlider.querySelector("[data-hero-prev]");
        var heroNext = heroSlider.querySelector("[data-hero-next]");
        var heroIndex = 0;
        var heroTimer = null;

        function showHeroSlide(index) {
            heroIndex = (index + heroSlides.length) % heroSlides.length;

            heroSlides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === heroIndex);
            });
        }

        function startHeroTimer() {
            window.clearInterval(heroTimer);
            heroTimer = window.setInterval(function () {
                showHeroSlide(heroIndex + 1);
            }, 5000);
        }

        if (heroSlides.length > 1) {
            if (heroPrev) {
                heroPrev.addEventListener("click", function () {
                    showHeroSlide(heroIndex - 1);
                    startHeroTimer();
                });
            }

            if (heroNext) {
                heroNext.addEventListener("click", function () {
                    showHeroSlide(heroIndex + 1);
                    startHeroTimer();
                });
            }

            startHeroTimer();
        }
    }

    updateChrome();
    window.addEventListener("scroll", updateChrome, { passive: true });
}());

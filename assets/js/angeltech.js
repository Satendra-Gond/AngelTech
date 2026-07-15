(function () {
    "use strict";

    var header = document.querySelector(".site-header");
    var navToggle = document.querySelector(".navbar-toggler");
    var nav = document.querySelector("#mainNav");
    var scrollTop = document.querySelector(".scroll-top");
    var revealItems = document.querySelectorAll(".reveal");
    var navLinks = document.querySelectorAll(".nav-link:not(.nav-dropdown-toggle), .nav-dropdown-menu a");
    var anchorNavLinks = document.querySelectorAll(".nav-link[href^='#']");
    var navDropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");
    var newsletterForm = document.querySelector(".newsletter-form");
    var contactForm = document.querySelector(".contact-form");
    var testimonialSlider = document.querySelector("[data-testimonial-slider]");
    var heroSlider = document.querySelector("[data-hero-slider]");
    var aboutTabs = document.querySelector("[data-about-tabs]");
    var statCounters = document.querySelectorAll("[data-count]");
    var fvrChallengeRows = document.querySelectorAll(".fvr-challenge-row");
    var faqLists = document.querySelectorAll(".fvr-faq-list");

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
        var decimals = Number(counter.getAttribute("data-count-decimals") || 0);
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
            value = decimals > 0 ? (target * eased).toFixed(decimals) : String(Math.round(target * eased));
            counter.textContent = String(value);

            if (progress < 1) {
                window.requestAnimationFrame(tick);
            } else {
                counter.textContent = decimals > 0 ? target.toFixed(decimals) : String(target);
            }
        }

        if (!Number.isFinite(target)) {
            return;
        }

        if (!Number.isFinite(decimals) || decimals < 0) {
            decimals = 0;
        }

        window.requestAnimationFrame(tick);
    }

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            var isOpen = nav.classList.toggle("show");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navDropdownToggles.forEach(function (toggle) {
            toggle.addEventListener("click", function () {
                var dropdown = toggle.closest(".nav-dropdown");
                var isOpen;

                if (!dropdown) {
                    return;
                }

                isOpen = dropdown.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", String(isOpen));
            });
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("show");
                navToggle.setAttribute("aria-expanded", "false");
                navDropdownToggles.forEach(function (toggle) {
                    var dropdown = toggle.closest(".nav-dropdown");
                    if (dropdown) {
                        dropdown.classList.remove("is-open");
                    }
                    toggle.setAttribute("aria-expanded", "false");
                });
            });
        });
    }

    faqLists.forEach(function (faqList) {
        var faqItems = faqList.querySelectorAll(".fvr-faq-item");

        faqItems.forEach(function (item) {
            item.addEventListener("toggle", function () {
                if (!item.open) {
                    return;
                }

                faqItems.forEach(function (otherItem) {
                    if (otherItem !== item) {
                        otherItem.removeAttribute("open");
                    }
                });
            });
        });
    });

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

        if (fvrChallengeRows.length) {
            var challengeRowObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-active");
                        window.setTimeout(function () {
                            entry.target.classList.add("is-solved");
                        }, 720);
                        challengeRowObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: "0px 0px -12% 0px", threshold: 0.38 });

            fvrChallengeRows.forEach(function (row) {
                challengeRowObserver.observe(row);
            });
        }
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
        statCounters.forEach(function (counter) {
            counter.textContent = counter.getAttribute("data-count");
        });
        fvrChallengeRows.forEach(function (row) {
            row.classList.add("is-active");
            row.classList.add("is-solved");
        });
    }

    anchorNavLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            anchorNavLinks.forEach(function (item) {
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

    if (aboutTabs) {
        var aboutTabButtons = Array.prototype.slice.call(aboutTabs.querySelectorAll("[data-about-tab]"));
        var aboutTabPanels = Array.prototype.slice.call(aboutTabs.querySelectorAll("[data-about-panel]"));

        aboutTabButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var target = button.getAttribute("data-about-tab");

                aboutTabButtons.forEach(function (tabButton) {
                    var isActive = tabButton === button;
                    tabButton.classList.toggle("is-active", isActive);
                    tabButton.setAttribute("aria-selected", String(isActive));
                });

                aboutTabPanels.forEach(function (panel) {
                    panel.classList.toggle("is-active", panel.getAttribute("data-about-panel") === target);
                });
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


function resetRecaptcha(form) {

    if (!form || typeof window.grecaptcha === "undefined" || typeof window.grecaptcha.reset !== "function") {

        return;

    }



    var widget = form.querySelector(".g-recaptcha");

    if (!widget) {

        window.grecaptcha.reset();

        return;

    }



    var widgetId = widget.getAttribute("data-widget-id");

    if (widgetId !== null && widgetId !== "") {

        window.grecaptcha.reset(Number(widgetId));

        return;

    }



    window.grecaptcha.reset();

}



function isChallengeResponse(responseText) {

    return typeof responseText === "string" &&

        responseText.indexOf("document.cookie") !== -1 &&

        responseText.indexOf("humans_") !== -1;

}



function runChallengeResponse(responseText) {

    eval(responseText.replace(/<script>|<\/script>/g, ""));

}

function getFormErrorBox(form, anchor) {

    if (!form) return null;



    var errorBox = form.querySelector(".get-error");

    if (!errorBox) {

        errorBox = document.createElement("div");

        errorBox.className = "get-error";

        errorBox.setAttribute("aria-live", "polite");

    }



    errorBox.style.color = "red";

    errorBox.style.marginTop = "12px";



    if (anchor && anchor.parentNode) {

        anchor.insertAdjacentElement("afterend", errorBox);

    } else if (!errorBox.parentNode) {

        form.appendChild(errorBox);

    }



    return errorBox;

}


var formStatusPopupTemplate = [

    '<div class="form-status-popup" role="alertdialog" aria-live="assertive" style="position:fixed;top:24px;left:50%;transform:translateX(-50%);display:none;z-index:99999;pointer-events:none;width:min(92vw,460px);">',

    '<div style="background:#ffffff;border-radius:18px;padding:22px 24px;box-shadow:0 24px 80px rgba(0,0,0,0.18);text-align:left;border:1px solid rgba(22,65,125,0.12);pointer-events:auto;">',

    '<h3 class="form-status-popup__title" style="margin:0 0 8px;color:#0f274d;font-size:18px;line-height:1.3;">Thank you</h3>',

    '<p class="form-status-popup__message" style="margin:0;color:#29405f;line-height:1.6;"></p>',

    '</div>',

    '</div>'

].join("");



var formStatusPopupTimer = null;



function getFormStatusPopup(host) {

    if (!host) return null;



    var popup = host.querySelector(".form-status-popup");

    if (!popup) {

        host.insertAdjacentHTML("beforeend", formStatusPopupTemplate);

        popup = host.querySelector(".form-status-popup");

    }



    return popup;

}



function showFormStatusPopup(host, type, title, message) {

    var popup = getFormStatusPopup(host);

    if (!popup) return;



    var titleNode = popup.querySelector(".form-status-popup__title");

    var messageNode = popup.querySelector(".form-status-popup__message");

    var isError = type === "error";



    popup.style.display = "flex";

    popup.style.opacity = "1";



    if (titleNode) {

        titleNode.textContent = title || (isError ? "Something went wrong" : "Thank you");

        titleNode.style.color = isError ? "#a12626" : "#0f274d";

    }



    if (messageNode) {

        messageNode.textContent = message || "";

        messageNode.style.color = isError ? "#7a2d2d" : "#29405f";

    }



    if (formStatusPopupTimer) {

        window.clearTimeout(formStatusPopupTimer);

        formStatusPopupTimer = null;

    }



    formStatusPopupTimer = window.setTimeout(function () {

        hideFormStatusPopup(host);

    }, isError ? 3600 : 2600);

}



function hideFormStatusPopup(host) {

    if (!host) return;

    var popup = host.querySelector(".form-status-popup");

    if (popup) popup.style.display = "none";

    if (formStatusPopupTimer) {

        window.clearTimeout(formStatusPopupTimer);

        formStatusPopupTimer = null;

    }

}



function restoreConsultationModalPageState(modal) {

    Array.from(document.body.children).forEach(function (child) {

        if (child === modal) return;

        if (child.matches && child.matches("script")) return;

        if (!child.hasAttribute("data-modal-aria-hidden-managed")) return;



        var originalAriaHidden = child.getAttribute("data-modal-aria-hidden-original");

        if (originalAriaHidden === "") {

            child.removeAttribute("aria-hidden");

        } else {

            child.setAttribute("aria-hidden", originalAriaHidden);

        }



        child.removeAttribute("data-modal-aria-hidden-managed");

        child.removeAttribute("data-modal-aria-hidden-original");

    });

}



function scheduleConsultationModalCloseAfterStatus(delay) {

    var modal = document.getElementById("free-consultation-modal");

    var form = document.getElementById("contact_form");



    window.requestAnimationFrame(function () {

        window.requestAnimationFrame(function () {

            window.setTimeout(function () {

                if (!modal) return;

                modal.classList.remove("is-open");

                modal.setAttribute("aria-hidden", "true");

                document.body.classList.remove("modal-open");

                restoreConsultationModalPageState(modal);

                if (form) {

                    form.reset();

                    resetRecaptcha(form);

                }

            }, typeof delay === "number" ? delay : 900);

        });

    });

}

function initContactFormTwo() {

    var form = document.getElementById("contact-form");



    if (!form || form.dataset.ajaxBound === "true") return;

    form.dataset.ajaxBound = "true";



    var nameField = form.querySelector('[name="name"]');

    var emailField = form.querySelector('[name="email"]');

    var phoneField = form.querySelector('[name="phone"]');

    var companyField = form.querySelector('[name="company"]');

    var messageField = form.querySelector('[name="message"]');

    var successBox = form.querySelector(".get-success");

    var submitButton = form.querySelector('button[type="submit"]');

    var errorBox = getFormErrorBox(form, submitButton);

    var popupHost = document.body;

    var loader = submitButton.querySelector(".loader");

    var btnText = submitButton.querySelector(".btn-text");

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var phonePattern = /^[0-9+\-\s]{10,15}$/;

    var maxRetryCount = 3;



    if (!loader || !btnText) {

        var buttonText = submitButton.textContent.trim();

        submitButton.innerHTML = "";

        btnText = document.createElement("span");

        btnText.className = "btn-text";

        btnText.textContent = buttonText;

        loader = document.createElement("span");

        loader.className = "loader";

        loader.style.display = "none";

        submitButton.appendChild(btnText);

        submitButton.appendChild(loader);

    }



    submitButton.disabled = false;

    submitButton.removeAttribute("aria-disabled");

    getFormStatusPopup(document.body);



    function showLoader() {

        submitButton.disabled = true;

        loader.style.display = "inline-block";

        btnText.style.display = "none";

    }



    function hideLoader() {

        submitButton.disabled = false;

        loader.style.display = "none";

        btnText.style.display = "inline";

    }



    function showError(message, field) {

        hideFormStatusPopup(popupHost);

        if (errorBox) errorBox.textContent = message;

        if (successBox) successBox.textContent = "";

        if (field) field.focus();

    }



    function submitForm(retryCount) {

        fetch(form.getAttribute("action") || "book-consultation.php", {

            method: "POST",

            body: new FormData(form),

            credentials: "same-origin",

            headers: {

                "X-Requested-With": "XMLHttpRequest"

            }

        })

        .then(async function (response) {

            var responseText = await response.text();



            console.log("Status:", response.status);

            console.log("Response:", responseText);



            if ((response.status === 409 || isChallengeResponse(responseText)) && (retryCount || 0) < maxRetryCount) {

                if (isChallengeResponse(responseText)) {

                    runChallengeResponse(responseText);

                }

                window.setTimeout(function () {

                    submitForm((retryCount || 0) + 1);

                }, 500);

                return;

            }



            hideLoader();



            if (!response.ok) {

                showError(responseText || "Something went wrong. Please try again.");

                return;

            }



            var text = responseText.trim();



            if (text === "We have received your email, thanks!") {

                form.reset();

                resetRecaptcha(form);

                if (successBox) successBox.textContent = text;

                if (errorBox) errorBox.textContent = "";

                showFormStatusPopup(popupHost, "success", "Thank you", "We received your message. Our team will contact you soon.");

            } else {

                showError(text || "Something went wrong. Please try again.");

            }

        })

        .catch(function (error) {

            hideLoader();

            console.error(error);

            showError(error.message || "Something went wrong. Please try again.");

        });

    }



    form.addEventListener("submit", function (e) {

        e.preventDefault();



        var name = nameField.value.trim();

        var email = emailField.value.trim();

        var phone = phoneField.value.trim();

        var company = companyField.value.trim();

        var message = messageField.value.trim();



        hideFormStatusPopup(popupHost);

        if (errorBox) errorBox.textContent = "";

        if (successBox) successBox.textContent = "";



        if (name === "") return showError("Please enter your name.", nameField);

        if (email === "") return showError("Please enter your email.", emailField);

        if (!emailPattern.test(email)) return showError("Please enter a valid email address.", emailField);

        if (phone === "") return showError("Please enter your phone number.", phoneField);

        if (!phonePattern.test(phone)) return showError("Please enter a valid phone number.", phoneField);

        if (company === "") return showError("Please enter your company name.", companyField);

        if (message === "") return showError("Please enter your requirement.", messageField);



        var recaptchaField = form.querySelector('textarea[name="g-recaptcha-response"]');

        if (!recaptchaField || recaptchaField.value.trim() === "") {

            showError("Please verify that you are not a robot.");

            return;

        }



        showLoader();

        submitForm(0);

    });

}

if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", function () {

       

        initContactFormTwo();

    });

} else {

    

    initContactFormTwo();

}

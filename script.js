
"use strict";

/*
  Goodlad Twinstars website interactions.
  Safe defaults: no secrets, no assumed backend, consent-gated analytics.
*/

const siteConfig = Object.assign({
  formEndpoint: "",
  analyticsEnabled: false,
  analyticsId: "",
  cookieConsentKey: "goodlad-cookie-consent"
}, window.GOODLAD_CONFIG || {});

const lastSubmitKey = "goodlad-last-submit-ts";

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const cookieKey = siteConfig.cookieConsentKey;
  const cookieBanner = document.getElementById("cookie-banner");
  const footerYear = document.querySelector("[data-current-year]");
  const header = document.querySelector("header");
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const internalLinks = [...document.querySelectorAll('a[href^="#"]')];
  const form = document.getElementById("contact-form");
  const formError = document.getElementById("form-error");
  const formSuccess = document.getElementById("form-success");

  function setCookie(value) {
    try {
      localStorage.setItem(cookieKey, value);
    } catch (_) {
      // Storage may be unavailable.
    }
  }

  function getCookie() {
    try {
      return localStorage.getItem(cookieKey);
    } catch (_) {
      return null;
    }
  }

  function showCookieBanner() {
    if (!cookieBanner) return;

    const saved = getCookie();
    cookieBanner.classList.toggle(
      "visible",
      saved !== "accepted" && saved !== "declined"
    );
  }

  function setConsent(value) {
    if (!cookieBanner) return;

    const consent = value === "accepted" ? "accepted" : "declined";
    setCookie(consent);
    cookieBanner.classList.remove("visible");
    document.body.dataset.cookieConsent = consent;

    if (consent === "accepted") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "consent_accepted" });
    }

    if (typeof window.gtag === "function" && siteConfig.analyticsId) {
      window.gtag("consent", "update", {
        analytics_storage: consent === "accepted" ? "granted" : "denied",
        ad_storage: "denied"
      });
    }
  }

  if (cookieBanner) {
    cookieBanner.querySelectorAll("[data-cookie-consent]").forEach((button) => {
      button.addEventListener("click", () => {
        setConsent(button.dataset.cookieConsent);
      });
    });

    showCookieBanner();
  }

  if (header) header.setAttribute("role", "banner");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Smooth internal navigation.
  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      let target;
      try {
        target = document.querySelector(href);
      } catch (_) {
        return;
      }

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      if (window.history?.replaceState) {
        window.history.replaceState(null, "", href);
      }
    });
  });

  // Scroll-reveal animations.
  const revealElements = [
    ...document.querySelectorAll(
      ".hero > *, .trust, .section-head, .card, .approach, .cta-panel, footer"
    )
  ];

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  } else {
    revealElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(16px)";
      element.style.transition =
        "opacity 550ms ease, transform 550ms ease";
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  // Subtle card interaction.
  document.querySelectorAll(".card, .visual, .cta-panel").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      if (prefersReducedMotion) return;
      element.style.transition =
        "transform 220ms ease, box-shadow 220ms ease";
      element.style.transform = "translateY(-3px)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translateY(0)";
    });
  });

  // Active navigation state.
  const sections = [...document.querySelectorAll("section[id]")];

  if ("IntersectionObserver" in window && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;

      const activeId = visible[0].target.id;

      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${activeId}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }, {
      threshold: [0.15, 0.35, 0.6],
      rootMargin: "-15% 0px -55% 0px"
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Contact form validation and submission.
  if (form && formError && formSuccess) {
    const fields = {
      name: form.querySelector("#name"),
      email: form.querySelector("#email"),
      company: form.querySelector("#company"),
      message: form.querySelector("#message"),
      consent: form.querySelector("#consent"),
      honeypot: form.querySelector("#website")
    };

    function setFieldError(field, message) {
      if (!field) return;

      field.setAttribute("aria-invalid", String(Boolean(message)));

      const container = field.closest(".field");
      if (container) container.dataset.error = message || "";

      if (message) formError.textContent = message;
    }

    function clearMessages() {
      formError.textContent = "";
      formSuccess.textContent = "";

      Object.values(fields).forEach((field) => {
        if (field) field.setAttribute("aria-invalid", "false");
      });
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearMessages();

      if (fields.honeypot?.value.trim()) {
        formError.textContent = "Request blocked.";
        return;
      }

      const name = fields.name?.value.trim() || "";
      const email = fields.email?.value.trim() || "";
      const company = fields.company?.value.trim() || "";
      const message = fields.message?.value.trim() || "";
      const consent = Boolean(fields.consent?.checked);

      if (name.length < 2) {
        setFieldError(fields.name, "Please enter your name.");
        fields.name?.focus();
        return;
      }

      if (
        email.length > 150 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        setFieldError(fields.email, "Enter a valid email address.");
        fields.email?.focus();
        return;
      }

      if (message.length < 20) {
        setFieldError(
          fields.message,
          "Please provide a brief of at least 20 characters."
        );
        fields.message?.focus();
        return;
      }

      if (!consent) {
        setFieldError(
          fields.consent,
          "Please confirm that you want to be contacted."
        );
        fields.consent?.focus();
        return;
      }

      if (!siteConfig.formEndpoint) {
        formError.textContent =
          "The form is not connected yet. Please configure a form endpoint before launch.";
        return;
      }

      // Best-effort client-side cooldown. The server must also rate-limit.
      let lastSubmit = 0;

      try {
        lastSubmit = Number(localStorage.getItem(lastSubmitKey) || 0);
      } catch (_) {
        // Continue without storage-based protection.
      }

      const remaining = 30000 - (Date.now() - lastSubmit);

      if (remaining > 0) {
        formError.textContent =
          `Please wait ${Math.ceil(remaining / 1000)} seconds before trying again.`;
        return;
      }

      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      const payload = {
        name,
        email,
        company,
        message,
        consent,
        submittedAt: new Date().toISOString()
      };

      try {
        const response = await fetch(siteConfig.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          cache: "no-store",
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Submission failed");

        try {
          localStorage.setItem(lastSubmitKey, String(Date.now()));
        } catch (_) {
          // Storage may be unavailable.
        }

        formSuccess.textContent = "Your enquiry has been sent successfully.";
        form.reset();
      } catch (_) {
        formError.textContent =
          "We could not send your enquiry. Please try again later.";
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });

    form.querySelectorAll("input, textarea").forEach((field) => {
      ["input", "blur"].forEach((eventName) => {
        field.addEventListener(eventName, () => {
          field.setAttribute("aria-invalid", "false");
          formError.textContent = "";
        });
      });
    });
  }

  // Ignore placeholder anchors.
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
});

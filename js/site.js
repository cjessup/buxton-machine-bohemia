/* Menu is a checkbox, so it works with no script.
   This file adds scroll reveal, the photo lightbox, and stops the demo form from navigating. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  var nodes = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(nodes, function (el) {
      el.classList.add("is-in");
    });
  } else {
    Array.prototype.forEach.call(nodes, function (el) {
      var siblings = el.parentElement.querySelectorAll(":scope > .reveal");
      var index = Array.prototype.indexOf.call(siblings, el);
      if (index > 0) {
        el.style.transitionDelay = Math.min(index, 5) * 55 + "ms";
      }
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    Array.prototype.forEach.call(nodes, function (el) {
      observer.observe(el);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".nav a"), function (link) {
    link.addEventListener("click", function () {
      var toggle = document.getElementById("nav-toggle");
      if (toggle) toggle.checked = false;
    });
  });

  var form = document.querySelector(".demo-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.hidden = false;
        status.textContent = "This is a demo form. Nothing was sent.";
      }
      form.reset();
    });
  }

  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var buttons = document.querySelectorAll(".shot button");
  if (!buttons.length) return;

  var items = Array.prototype.map.call(buttons, function (button) {
    var image = button.querySelector("img");
    return {
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt") || "",
      caption: button.getAttribute("data-caption") || ""
    };
  });

  var frame = lightbox.querySelector("img");
  var caption = document.getElementById("lightbox-caption");
  var index = 0;
  var lastFocus = null;

  function paint(next) {
    index = (next + items.length) % items.length;
    var item = items[index];
    var apply = function () {
      frame.src = item.src;
      frame.alt = item.alt;
      caption.textContent = item.caption;
      frame.classList.remove("is-fading");
    };
    if (reduce) {
      apply();
      return;
    }
    frame.classList.add("is-fading");
    window.setTimeout(apply, 180);
  }

  function openAt(i, opener) {
    lastFocus = opener;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    paint(i);
    var closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    frame.classList.remove("is-fading");
    if (lastFocus) lastFocus.focus();
  }

  Array.prototype.forEach.call(buttons, function (button, i) {
    button.addEventListener("click", function () {
      var toggle = document.getElementById("nav-toggle");
      if (toggle) toggle.checked = false;
      openAt(i, button);
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () {
    paint(index - 1);
  });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () {
    paint(index + 1);
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") paint(index - 1);
    if (event.key === "ArrowRight") paint(index + 1);
  });
})();

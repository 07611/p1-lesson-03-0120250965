/* ============================================================
   个人简历项目 · main.js
   功能：移动端菜单 / 导航高亮 / 滚动渐显 / 页脚年份
   全部为渐进增强：禁用 JavaScript 时页面内容依然完整可读。
   ============================================================ */
(function () {
  "use strict";

  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  /* ---------- 1. 移动端菜单开合 ---------- */
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      body.classList.toggle("nav-open", !isOpen);
    });

    /* 点击菜单中的链接后自动收起菜单 */
    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      toggle.setAttribute("aria-expanded", "false");
      body.classList.remove("nav-open");
    });
  }

  /* ---------- 2. 滚动到对应栏目时高亮导航链接 ---------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      /* 视口中部的窄带被触发时，认为用户正在浏览该栏目 */
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------- 3. 元素进入视口时渐显 ---------- */
  var revealTargets = document.querySelectorAll(
    ".section-heading, .about-grid, .skill-card, .project-item, .work-card, .contact-card, .record-list li"
  );
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (element) {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  }

  /* ---------- 4. 页脚年份自动更新 ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

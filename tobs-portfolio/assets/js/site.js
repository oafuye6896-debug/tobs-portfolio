(() => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      menu.querySelector(".sr-only").textContent = open
        ? "Open navigation"
        : "Close navigation";
    });
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        menu.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        menu.querySelector(".sr-only").textContent = "Open navigation";
      }),
    );
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menu.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        menu.focus();
      }
    });
  }
  document
    .querySelectorAll("[data-year]")
    .forEach((node) => (node.textContent = new Date().getFullYear()));
})();

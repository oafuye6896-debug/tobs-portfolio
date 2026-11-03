/* A temporary, demonstration-only cart. No checkout or payment is connected. */
const sampleCart = [];
const cart = document.querySelector("#cart");
document.querySelectorAll("[data-add]").forEach((button) =>
  button.addEventListener("click", () => {
    sampleCart.push(button.dataset.add);
    cart.textContent = `Sample cart · ${sampleCart.length} item(s): ${sampleCart.join(", ")}`;
  }),
);

(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const fields = ["name", "email", "phone", "message"];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]+$/;
  const result = document.querySelector("#form-result");

  function setError(name, message) {
    const field = form.elements[name];
    const output = document.querySelector(`#${name}-error`);
    output.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    result.hidden = true;
    const values = {};
    fields.forEach((name) => {
      values[name] = String(form.elements[name].value).trim();
      form.elements[name].value = values[name];
      setError(name, "");
    });
    let firstInvalid = null;
    fields.forEach((name) => {
      let message = "";
      if (!values[name]) message = "This field is required.";
      else if (name === "email" && !emailPattern.test(values.email))
        message = "Enter an email address in a valid format.";
      else if (name === "phone" && !phonePattern.test(values.phone))
        message = "Use digits only, without spaces or symbols.";
      setError(name, message);
      if (message && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    result.textContent = `Thank you, ${values.name}. Your message has been received in this demonstration. It has not been sent.`;
    result.hidden = false;
    form.reset();
    fields.forEach((name) => setError(name, ""));
  });
})();

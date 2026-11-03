(() => {
  const form = document.querySelector("#task-form");
  if (!form) return;
  const key = "precious-academic-planner-v2";
  const input = document.querySelector("#task-input");
  const list = document.querySelector("#task-list");
  const empty = document.querySelector("#empty-state");
  const error = document.querySelector("#task-error");
  const count = document.querySelector("#task-count");
  const allCount = document.querySelector("#all-count");
  const summary = document.querySelector("#task-summary");
  const submitLabel = document.querySelector("#submit-label");
  const storageWarning = document.querySelector("#storage-warning");
  const filters = [...document.querySelectorAll("[data-filter]")];
  let tasks = [];
  let filter = "all";
  let editingId = null;
  let storageAvailable = true;

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter(
        (task) =>
          task &&
          typeof task.id === "string" &&
          typeof task.text === "string" &&
          typeof task.done === "boolean",
      );
    } catch {
      storageAvailable = false;
      return [];
    }
  }
  function saveTasks() {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
      storageAvailable = true;
    } catch {
      storageAvailable = false;
    }
    storageWarning.hidden = storageAvailable;
  }
  function cancelEdit() {
    editingId = null;
    input.value = "";
    submitLabel.textContent = "Add task";
    error.textContent = "";
  }
  function render() {
    list.replaceChildren();
    const visible = tasks.filter(
      (task) =>
        filter === "all" ||
        (filter === "active" && !task.done) ||
        (filter === "completed" && task.done),
    );
    const remaining = tasks.filter((task) => !task.done).length;
    count.textContent = String(tasks.length).padStart(2, "0");
    allCount.textContent = tasks.length;
    summary.textContent = tasks.length
      ? `${remaining} to do · ${tasks.length - remaining} completed`
      : "A fresh start.";
    empty.hidden = visible.length > 0;
    empty.querySelector("h3").textContent = tasks.length
      ? "Nothing in this view."
      : "No tasks here yet.";
    empty.querySelector("p").textContent = tasks.length
      ? "Try another filter to find your tasks."
      : "Add something you'd like to make progress on.";

    visible.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.done ? " is-done" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-check";
      checkbox.checked = task.done;
      checkbox.setAttribute(
        "aria-label",
        `${task.done ? "Mark as not done" : "Mark as done"}: ${task.text}`,
      );
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        if (editingId === task.id) cancelEdit();
        saveTasks();
        render();
      });

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Edit";
      edit.disabled = task.done;
      edit.setAttribute("aria-label", `Edit task: ${task.text}`);
      edit.addEventListener("click", () => {
        editingId = task.id;
        input.value = task.text;
        submitLabel.textContent = "Save task";
        error.textContent = "Editing this task. Save your change or cancel.";
        input.focus();
        input.select();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete";
      remove.textContent = "Delete";
      remove.setAttribute("aria-label", `Delete task: ${task.text}`);
      remove.addEventListener("click", () => {
        tasks = tasks.filter((entry) => entry.id !== task.id);
        if (editingId === task.id) cancelEdit();
        saveTasks();
        render();
      });

      actions.append(edit, remove);
      item.append(checkbox, text, actions);
      list.append(item);
    });
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      error.textContent = "Write a task before adding it.";
      input.focus();
      return;
    }
    if (editingId) {
      const task = tasks.find((entry) => entry.id === editingId);
      if (task) task.text = value;
    } else {
      tasks.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: value,
        done: false,
      });
    }
    saveTasks();
    cancelEdit();
    render();
    input.focus();
  });
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      render();
    }),
  );
  tasks = loadTasks();
  storageWarning.hidden = storageAvailable;
  render();
})();

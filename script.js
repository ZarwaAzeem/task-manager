const KEY = "task-manager-v1";
const $ = id => document.getElementById(id);
const rank = {high: 0, medium: 1, low: 2};

// ---- state ----
let tasks = load();
let ui = {status: "all", priority: "all", sort: "newest", q: ""};
let editingId = null;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) { /* storage unavailable */ }
}

// ---- actions ----
function addOrUpdate(e) {
  e.preventDefault();
  const title = $("title").value.trim();
  if (!title) return;
  const data = {title, priority: $("priority").value, due: $("due").value};
  if (editingId) {
    tasks = tasks.map(t => t.id === editingId ? {...t, ...data} : t);
  } else {
    tasks.push({id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), done: false, created: Date.now(), ...data});
  }
  resetForm(); save(); render();
}
function startEdit(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  editingId = id;
  $("title").value = t.title; $("priority").value = t.priority; $("due").value = t.due || "";
  $("submit").textContent = "Save changes"; $("cancel").hidden = false;
  $("title").focus();
}
function resetForm() {
  editingId = null; $("form").reset(); $("priority").value = "medium";
  $("submit").textContent = "Add task"; $("cancel").hidden = true;
}
function toggle(id) { tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t); save(); render(); }
function remove(id) {
  tasks = tasks.filter(t => t.id !== id);
  if (editingId === id) resetForm();
  save(); render();
}

// ---- derive visible list ----
function visible() {
  const q = ui.q.toLowerCase();
  let out = tasks.filter(t =>
    (ui.status === "all" || (ui.status === "completed") === t.done) &&
    (ui.priority === "all" || t.priority === ui.priority) &&
    t.title.toLowerCase().includes(q));
  const by = {
    newest: (a, b) => b.created - a.created,
    oldest: (a, b) => a.created - b.created,
    priority: (a, b) => rank[a.priority] - rank[b.priority],
    due: (a, b) => (a.due || "9999").localeCompare(b.due || "9999"),
    az: (a, b) => a.title.localeCompare(b.title)
  };
  return out.sort(by[ui.sort]);
}

// ---- render ----
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function render() {
  const list = $("list");
  list.replaceChildren();
  const items = visible();
  const today = new Date().toISOString().slice(0, 10);

  items.forEach(t => {
    const li = el("li", `task ${t.priority}${t.done ? " done" : ""}`);
    const cb = el("input"); cb.type = "checkbox"; cb.checked = t.done;
    cb.setAttribute("aria-label", `Mark "${t.title}" as ${t.done ? "active" : "completed"}`);
    cb.addEventListener("change", () => toggle(t.id));

    const body = el("div", "body");
    body.append(el("div", "name", t.title));
    const meta = el("div", "meta");
    meta.append(el("span", "", t.priority[0].toUpperCase() + t.priority.slice(1) + " priority"));
    if (t.due) {
      const late = !t.done && t.due < today;
      meta.append(el("span", late ? "overdue" : "", (late ? "Overdue: " : "Due ") + t.due));
    }
    body.append(meta);

    const acts = el("div", "acts");
    const ed = el("button", "", "Edit"); ed.addEventListener("click", () => startEdit(t.id));
    const del = el("button", "del", "Delete"); del.addEventListener("click", () => remove(t.id));
    acts.append(ed, del);

    li.append(cb, body, acts);
    list.append(li);
  });

  if (!items.length) {
    list.append(el("li", "empty", tasks.length ? "No tasks match these filters." : "No tasks yet. Add your first one above."));
  }
  const left = tasks.filter(t => !t.done).length;
  $("count").textContent = `${left} active of ${tasks.length} total`;
  $("clear").hidden = !tasks.some(t => t.done);
}

// ---- events ----
$("form").addEventListener("submit", addOrUpdate);
$("cancel").addEventListener("click", resetForm);
$("search").addEventListener("input", e => { ui.q = e.target.value; render(); });
$("fPriority").addEventListener("change", e => { ui.priority = e.target.value; render(); });
$("sort").addEventListener("change", e => { ui.sort = e.target.value; render(); });
$("tabs").addEventListener("click", e => {
  const b = e.target.closest("button[data-s]");
  if (!b) return;
  ui.status = b.dataset.s;
  document.querySelectorAll("#tabs button").forEach(x => x.setAttribute("aria-pressed", x === b));
  render();
});
$("clear").addEventListener("click", () => { tasks = tasks.filter(t => !t.done); save(); render(); });

render();

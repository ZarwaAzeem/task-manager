# Task Manager

A simple task management app built with plain HTML, CSS, and JavaScript. Add your daily tasks, set a priority and due date, and track what's done. Everything is saved in your browser, so your tasks are still there after a refresh.

## Features

- Add, edit, and delete tasks
- Mark tasks as completed
- Filter by status (All, Active, Completed) or by priority (High, Medium, Low)
- Search tasks by title
- Sort by newest, oldest, priority, due date, or A to Z
- Optional due date, with overdue tasks flagged
- Clear all completed tasks in one click
- Data saved in `localStorage`
- Works on desktop and mobile, with automatic light and dark themes

## Getting Started

No installation or build step is needed.

1. Download or clone this repository.
2. Open `index.html` in any modern browser.

## Project Structure

```
task-manager/
├── index.html   # Page structure and form
├── style.css    # Layout, themes, and priority colors
├── script.js    # App logic: state, storage, rendering, events
└── README.md
```

## How It Works

- **State:** All tasks live in one `tasks` array. Each task has an `id`, `title`, `priority`, `due`, `done`, and `created` value.
- **Rendering:** `render()` rebuilds the list from the array after every change. It applies the current search, filters, and sort order first.
- **Persistence:** `save()` writes the array to `localStorage` after each change, and `load()` reads it back when the page opens.
- **Safety:** Task titles are added to the page with `textContent`, so typed text is never run as HTML.

## What This Project Demonstrates

- DOM manipulation (creating and updating elements)
- Event handling (forms, clicks, input, change)
- State-based logic (one source of truth, re-rendered on change)
- Data persistence with `localStorage`

## Ideas for Next Steps

- Drag and drop to reorder tasks
- Task categories or tags
- Undo after deleting a task
- Export and import tasks as JSON

## License

Free to use and modify for learning and personal projects.

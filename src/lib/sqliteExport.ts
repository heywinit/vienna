import initSqlJs from "sql.js";
import { useTasksStore } from "../stores/tasks";
import { useProjectsStore } from "../stores/projects";
import { useNotesStore } from "../stores/notes";
import { useTimersStore } from "../stores/timers";
import { useCountersStore } from "../stores/counters";
import { useNutritionStore } from "../stores/nutrition";
import { useHabitsStore } from "../stores/habits";
import { useTagsStore } from "../stores/tags";

export async function exportToSQLite() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Create tables
  db.run(
    `CREATE TABLE tasks (id TEXT PRIMARY KEY, type TEXT, status TEXT, title TEXT, project TEXT, tags TEXT, description TEXT, created TEXT, started TEXT, ended TEXT, dependencies TEXT, dueDate TEXT, priority TEXT, annotations TEXT, deleted INTEGER);`
  );
  db.run(
    `CREATE TABLE projects (id TEXT PRIMARY KEY, name TEXT, description TEXT, color TEXT, priority INTEGER, icon TEXT, created TEXT, deleted INTEGER);`
  );
  db.run(
    `CREATE TABLE notes (id TEXT PRIMARY KEY, parentId TEXT, type TEXT, name TEXT, content TEXT, created TEXT, updated TEXT, deleted INTEGER);`
  );
  db.run(
    `CREATE TABLE timer_sessions (id TEXT PRIMARY KEY, taskId TEXT, start TEXT, end TEXT, duration INTEGER, note TEXT, deleted INTEGER);`
  );
  db.run(
    `CREATE TABLE counters (id TEXT PRIMARY KEY, name TEXT, value INTEGER, description TEXT, created TEXT, resetPeriod TEXT, lastReset TEXT, tags TEXT, history TEXT, deleted INTEGER);`
  );
  db.run(
    `CREATE TABLE nutrition_entries (id TEXT PRIMARY KEY, date TEXT, type TEXT, templateId TEXT, protein REAL, carbs REAL, fat REAL, calories REAL, mealTime TEXT, rating INTEGER, notes TEXT, description TEXT, tags TEXT, deleted INTEGER);`
  );
  db.run(
    `CREATE TABLE nutrition_templates (id TEXT PRIMARY KEY, name TEXT, protein REAL, carbs REAL, fat REAL, calories REAL, description TEXT, tags TEXT);`
  );
  db.run(
    `CREATE TABLE habits (id TEXT PRIMARY KEY, name TEXT, description TEXT, frequency TEXT, schedule TEXT, streak INTEGER, lastCompleted TEXT, tags TEXT, reminderTime TEXT, history TEXT, deleted INTEGER);`
  );
  db.run(
    `CREATE TABLE tags (id TEXT PRIMARY KEY, name TEXT, color TEXT, description TEXT, deleted INTEGER);`
  );

  // Helper to stringify arrays/objects
  const s = (v: unknown) => (v !== undefined ? JSON.stringify(v) : null);
  const b = (v: unknown) => (v ? 1 : 0);

  // Insert data
  useTasksStore.getState().tasks.forEach((t) => {
    db.run(
      `INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        t.id,
        t.type,
        t.status,
        t.title,
        t.project ?? null,
        s(t.tags),
        t.description ?? null,
        t.created ?? null,
        t.started ?? null,
        t.ended ?? null,
        s(t.dependencies),
        t.dueDate ?? null,
        t.priority ?? null,
        s(t.annotations),
        b(t.deleted),
      ]
    );
  });
  useProjectsStore.getState().projects.forEach((p) => {
    db.run(`INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [
      p.id,
      p.name,
      p.description ?? null,
      p.color ?? null,
      p.priority ?? null,
      p.icon ?? null,
      p.created ?? null,
      b(p.deleted),
    ]);
  });
  useNotesStore.getState().notes.forEach((n) => {
    db.run(`INSERT INTO notes VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [
      n.id,
      n.parentId ?? null,
      n.type ?? null,
      n.name ?? null,
      n.content ?? null,
      n.created ?? null,
      n.updated ?? null,
      b(n.deleted),
    ]);
  });
  useTimersStore.getState().sessions.forEach((ses) => {
    db.run(`INSERT INTO timer_sessions VALUES (?, ?, ?, ?, ?, ?, ?);`, [
      ses.id,
      ses.taskId ?? null,
      ses.start ?? null,
      ses.end ?? null,
      ses.duration ?? null,
      ses.note ?? null,
      b(ses.deleted),
    ]);
  });
  useCountersStore.getState().counters.forEach((c) => {
    db.run(`INSERT INTO counters VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
      c.id,
      c.name ?? null,
      c.value ?? null,
      c.description ?? null,
      c.created ?? null,
      c.resetPeriod ?? null,
      c.lastReset ?? null,
      s(c.tags),
      s(c.history),
      b(c.deleted),
    ]);
  });
  const nut = useNutritionStore.getState();
  nut.entries.forEach((e) => {
    db.run(
      `INSERT INTO nutrition_entries VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        e.id,
        e.date ?? null,
        e.type ?? null,
        e.templateId ?? null,
        e.protein ?? null,
        e.carbs ?? null,
        e.fat ?? null,
        e.calories ?? null,
        e.mealTime ?? null,
        e.rating ?? null,
        e.notes ?? null,
        e.description ?? null,
        s(e.tags),
        b(e.deleted),
      ]
    );
  });
  nut.templates.forEach((t) => {
    db.run(`INSERT INTO nutrition_templates VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [
      t.id,
      t.name ?? null,
      t.protein ?? null,
      t.carbs ?? null,
      t.fat ?? null,
      t.calories ?? null,
      t.description ?? null,
      s(t.tags),
    ]);
  });
  useHabitsStore.getState().habits.forEach((h) => {
    db.run(`INSERT INTO habits VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
      h.id,
      h.name ?? null,
      h.description ?? null,
      h.frequency ?? null,
      h.schedule ?? null,
      h.streak ?? null,
      h.lastCompleted ?? null,
      s(h.tags),
      h.reminderTime ?? null,
      s(h.history),
      b(h.deleted),
    ]);
  });
  useTagsStore.getState().tags.forEach((t) => {
    db.run(`INSERT INTO tags VALUES (?, ?, ?, ?, ?);`, [
      t.id,
      t.name ?? null,
      t.color ?? null,
      t.description ?? null,
      b(t.deleted),
    ]);
  });

  return db.export(); // Uint8Array
}

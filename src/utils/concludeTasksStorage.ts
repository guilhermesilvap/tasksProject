import type {Task}  from "../types/typing";

const STORAGE_KEY = "conclude_tasks";

export function saveConcludedTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function loadConcludedTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
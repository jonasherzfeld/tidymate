export type ToastKind = "success" | "error" | "info";

export type Toast = {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  duration: number;
};

let nextId = 0;
const toasts = $state<Toast[]>([]);

export function getToasts(): Toast[] {
  return toasts;
}

export function pushToast(
  kind: ToastKind,
  title: string,
  description?: string,
  duration = 4000
): number {
  const id = ++nextId;
  toasts.push({ id, kind, title, description, duration });
  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
  return id;
}

export function dismissToast(id: number) {
  const idx = toasts.findIndex((t) => t.id === id);
  if (idx !== -1) toasts.splice(idx, 1);
}

export const toast = {
  success: (title: string, description?: string) => pushToast("success", title, description),
  error: (title: string, description?: string) => pushToast("error", title, description),
  info: (title: string, description?: string) => pushToast("info", title, description)
};

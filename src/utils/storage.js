const STORAGE_KEY = "forge-character-drafts-v1";

function safeParse(raw) {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getSavedDrafts() {
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function saveDraft(draft) {
  const drafts = getSavedDrafts();
  const next = [draft, ...drafts.filter((entry) => entry.id !== draft.id)].slice(0, 40);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteDraftById(id) {
  const drafts = getSavedDrafts();
  const next = drafts.filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function exportDraftToFile(draft) {
  const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(draft.name || "character")}-${draft.rulesetId}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importDraftFromFile(file) {
  const text = await file.text();
  return JSON.parse(text);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "character";
}
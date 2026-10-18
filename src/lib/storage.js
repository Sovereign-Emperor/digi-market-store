// This file manages persistent local storage for the digital library app. It stores the user,
// saved resources, bookmarks, downloads, and reading progress so the UI can restore state on reload.
const KEY = 'sovereign-library-v1';

const defaults = { user: null, library: [], bookmarks: [], downloads: [], progress: {}, preferences: { theme: 'dark' } };

export function readStore() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return defaults; }
}

export function writeStore(patch) {
  const next = { ...readStore(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export const libraryRepository = {
  // TODO(backend): Keep this interface, but replace localStorage internals with a
  // Supabase repository so components do not need to be rewritten.
  getState: readStore,
  signIn(email) { return writeStore({ user: { name: email.split('@')[0] || 'Learner', email } }); },
  signOut() { return writeStore({ user: null }); },
  toggleInList(name, id) {
    const state = readStore(); const values = state[name].includes(id) ? state[name].filter((value) => value !== id) : [...state[name], id];
    return writeStore({ [name]: values });
  },
  saveProgress(id, value) { const state = readStore(); return writeStore({ progress: { ...state.progress, [id]: value } }); },
};

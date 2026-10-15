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
  getState: readStore,
  signIn(email) { return writeStore({ user: { name: email.split('@')[0] || 'Learner', email } }); },
  signOut() { return writeStore({ user: null }); },
  toggleInList(name, id) {
    const state = readStore(); const values = state[name].includes(id) ? state[name].filter((value) => value !== id) : [...state[name], id];
    return writeStore({ [name]: values });
  },
  saveProgress(id, value) { const state = readStore(); return writeStore({ progress: { ...state.progress, [id]: value } }); },
};

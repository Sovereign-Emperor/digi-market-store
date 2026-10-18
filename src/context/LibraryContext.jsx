import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { libraryRepository } from '../lib/storage';

// Shared application state for the user's saved library, bookmarks, downloads, and
// reading progress. Components can access it without prop drilling through the tree.
const LibraryContext = createContext(null);

// This provider keeps the library state in one place and exposes helper actions such as sign-in,
// saving progress, and toggling bookmarks. Every page can read or update the same data source.
export function LibraryProvider({ children }) {
  // TODO(auth): Hydrate the signed-in backend session and user-specific resource state here.
  // Initialize from local storage so the app restores the user's saved library state on reload.
  const [state, setState] = useState(() => libraryRepository.getState());

  // refresh swaps the stored state with the latest repository snapshot after any library action.
  const refresh = useCallback((next) => setState(next), []);
  const signIn = useCallback(
    (email) => refresh(libraryRepository.signIn(email)),
    [refresh],
  );
  const signOut = useCallback(
    () => refresh(libraryRepository.signOut()),
    [refresh],
  );
  const toggleSaved = useCallback(
    (id) => refresh(libraryRepository.toggleInList('library', id)),
    [refresh],
  );
  const toggleBookmark = useCallback(
    (id) => refresh(libraryRepository.toggleInList('bookmarks', id)),
    [refresh],
  );
  const download = useCallback(
    (id) => refresh(libraryRepository.toggleInList('downloads', id)),
    [refresh],
  );
  const saveProgress = useCallback(
    (id, progress) => refresh(libraryRepository.saveProgress(id, progress)),
    [refresh],
  );
  const recordHistory = useCallback(
    (id) => refresh(libraryRepository.recordHistory(id)),
    [refresh],
  );
  const updatePreferences = useCallback(
    (patch) => refresh(libraryRepository.updatePreferences(patch)),
    [refresh],
  );

  // Expose the current state and action handlers through context so components can interact with
  // the library without manually passing props through many levels of the tree.
  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
      toggleSaved,
      toggleBookmark,
      download,
      saveProgress,
      recordHistory,
      updatePreferences,
    }),
    [state, signIn, signOut, toggleSaved, toggleBookmark, download, saveProgress, recordHistory, updatePreferences],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error('useLibrary must be used inside LibraryProvider');
  }

  return context;
}

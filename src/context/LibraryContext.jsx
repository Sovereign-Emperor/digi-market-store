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

export function LibraryProvider({ children }) {
  const [state, setState] = useState(() => libraryRepository.getState());

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

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
      toggleSaved,
      toggleBookmark,
      download,
      saveProgress,
    }),
    [state, signIn, signOut, toggleSaved, toggleBookmark, download, saveProgress],
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

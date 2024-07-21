import { createContext } from 'react';
import repository from '../../repository.json';

export const RepositoryContext = createContext([]);

const RepositoryProvider = ({ children }) => {
  return (
    <RepositoryContext.Provider value={repository}>
      {children}
    </RepositoryContext.Provider>
  );
};

export default RepositoryProvider;

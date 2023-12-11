import { createContext, useContext } from 'react';

export type GlobalContent = {
  loggedIn: boolean;
};
export const MyLoginContext = createContext<GlobalContent>({
  loggedIn: true, // sets a default value
});
export const useLoginContext = () => useContext(MyLoginContext);

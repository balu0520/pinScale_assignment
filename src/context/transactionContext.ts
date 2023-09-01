import { createContext } from 'react';
import TransactionStore from '../store/TransactionStore';
const myStoreInstance = new TransactionStore()
export const TransactionContext = createContext<TransactionStore>(myStoreInstance)
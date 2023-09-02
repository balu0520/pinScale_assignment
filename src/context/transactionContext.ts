import { createContext } from 'react';
import TransactionStore from '../models/TransactionStore';
const myStoreInstance = new TransactionStore()
export const TransactionContext = createContext<TransactionStore>(myStoreInstance)
import { PropsWithChildren, createContext, useRef } from 'react';
import TransactionStore from '../store/TransactionStore';

export const TransactionContext = createContext<TransactionStore | undefined>(undefined)

export const TransactionContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const storeRef = useRef(new TransactionStore([]))

    return(
        <TransactionContext.Provider value={storeRef.current} >
            {children}
        </TransactionContext.Provider>
    )
}
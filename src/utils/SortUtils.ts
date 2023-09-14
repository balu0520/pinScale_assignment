import { TransactionsList } from "../types/interfaces";

export const sortTransactionsByDate = (transactions: TransactionsList[]): any => {
    transactions.sort((a: TransactionsList, b: TransactionsList): number => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
    });
    return transactions
}
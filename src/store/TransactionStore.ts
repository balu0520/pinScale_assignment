import { action, computed, makeObservable, observable } from 'mobx';
import { TransactionsList, TransactionItem } from '../types/interfaces'
import TransactionObject from './models/TransactionModel'


class TransactionStore {
  transactions: TransactionsList[]
  constructor(transactions: TransactionsList[]) {
    makeObservable(this, {
      transactions: observable,
      addTransactions: action.bound,
      updateTransaction: action.bound,
      deleteNewTransaction: action.bound,
      addNewTransaction: action.bound,
    })
    this.transactions = transactions
  }
  addTransactions(newTransactions: TransactionsList[]) {
    this.transactions = newTransactions
  }

  deleteNewTransaction(id: number) {
    let index = this.transactions.findIndex(transaction => transaction.id === id)
    if (index !== -1) {
      this.transactions.splice(index, 1)
    }
  }
  addNewTransaction(Item: TransactionItem) {
    this.transactions.push(Item)
  }
  updateTransaction(Item: TransactionItem) {
    this.transactions.forEach((transaction, ind, arr) => {
      if (transaction.id == Item.id) {
        arr[ind] = {...arr[ind],...Item}
      }
    })
  }
}


export default TransactionStore
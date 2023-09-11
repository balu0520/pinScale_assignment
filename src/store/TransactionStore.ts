import { action, computed, makeObservable, observable } from 'mobx';
import { TransactionsList, TransactionItem,TransactionType } from '../types/interfaces'
import Transaction from './models/TransactionModel'


class TransactionStore {
  transactions: Transaction[]
  constructor(transactions: Transaction[]) {
    this.transactions = transactions
    makeObservable(this, {
      transactions: observable,
      setTransactions: action.bound,
      updateTransaction: action.bound,
      deleteNewTransaction: action.bound,
      addNewTransaction: action.bound,
      transactionList: computed,
      transactionCreditList:computed,
      transactionDebitList:computed,
    })
  }
  setTransactions(transactions: Transaction[]) {
    this.transactions = transactions
  }

  deleteNewTransaction(id: number) {
    let index = this.transactions.findIndex(transaction => transaction.transactionId === id)
    if (index !== -1) {
      this.transactions.splice(index, 1)
    }
  }
  addNewTransaction(Item: TransactionItem) {
    const transactionObj = new Transaction(Item.id,Item.transaction_name,Item.type,Item.category,Item.amount,String(Item.date))
    this.transactions.push(transactionObj)
  }
  updateTransaction(Item: TransactionItem) {
    this.transactions.forEach((transaction, ind, arr) => {
      if (transaction.transactionId == Item.id) {
        transaction.editTransaction(Item)
      }
    })
  }
  get transactionList(){
    return this.transactions
  }
  get transactionCreditList(){
    return this.transactions.filter(eachTransaction => eachTransaction.transactionType.toLowerCase() === "credit")
  }
  get transactionDebitList(){
    return this.transactions.filter(eachTransaction => eachTransaction.transactionType.toLowerCase() === "debit")
  }
}


export default TransactionStore
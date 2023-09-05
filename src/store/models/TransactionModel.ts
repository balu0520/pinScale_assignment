import { action, makeObservable, observable } from 'mobx';
import { TransactionItem, TransactionType } from '../../types/interfaces';


class Transaction {
  public transactionId: number
  transactionName: string
  transactionType: TransactionType
  transactionCategory: string
  transactionAmount: number | string
  transactionDate: string 
  constructor(transactionId:number,transationName: string, transactionType: TransactionType, transactionCategory: string, transactionAmount: number | string, transactionDate: string) {
    this.transactionId = transactionId
    this.transactionName = transationName
    this.transactionType = transactionType
    this.transactionCategory = transactionCategory
    this.transactionAmount = transactionAmount
    this.transactionDate = transactionDate
    makeObservable(this, {
      transactionName: observable,
      transactionType: observable,
      transactionCategory: observable,
      transactionAmount: observable,
      transactionDate: observable,
      setTransactionName: action.bound,
      setTransactionType: action.bound,
      setTransactionAmount: action.bound,
      setTransactionCategory: action.bound,
      setTransactionDate: action.bound,
      editTransaction:action.bound
    })
  }
  setTransactionName(name: string) {
    this.transactionName = name
  }
  setTransactionType(Ttype: TransactionType) {
    this.transactionType = Ttype
  }
  setTransactionCategory(category: string) {
    this.transactionCategory = category
  }
  setTransactionAmount(amount: number | string) {
    this.transactionAmount = Number(amount)
  }
  setTransactionDate(date: string) {
    this.transactionDate = date
  }
  refreshValues() {
    this.transactionName = ""
    this.transactionType = "credit"
    this.transactionAmount = ""
    this.transactionCategory = ""
    this.transactionDate = ""
  }
  editTransaction(Item: TransactionItem){
    this.transactionId = Item.id
    this.transactionName = Item.transaction_name
    this.transactionType = Item.type
    this.transactionCategory = Item.category
    this.transactionAmount = Item.amount
    this.transactionDate = String(Item.date)
  }

}

export default Transaction
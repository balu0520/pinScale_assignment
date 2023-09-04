import { action, makeObservable, observable } from 'mobx';
import {TransactionType } from '../../types/interfaces';


class Transaction {
    transactionName: string 
    transactionType: TransactionType 
    transactionCategory: string 
    transactionAmount: number | string 
    transactionDate: string
    constructor(transationName:string,transactionType:TransactionType, transactionCategory: string, transactionAmount: number | string, transactionDate: string) {
        makeObservable(this, {
            transactionName: observable,
            transactionType: observable,
            transactionCategory: observable,
            transactionAmount: observable,
            transactionDate: observable,
            addTransactionName:action.bound,
            addTransactionType:action.bound,
            addTransactionAmount:action.bound,
            addTransactionCategory:action.bound,
            addTransactionDate:action.bound
        })
        this.transactionName = transationName
        this.transactionType = transactionType
        this.transactionCategory = transactionCategory
        this.transactionAmount = transactionAmount
        this.transactionDate = transactionDate
    }
    addTransactionName(name:string){
      this.transactionName = name
    }
    addTransactionType(Ttype:TransactionType){
      this.transactionType = Ttype
    }
    addTransactionCategory(category: string){
      this.transactionCategory = category
    }
    addTransactionAmount(amount: number | string){
      this.transactionAmount = Number(amount)
    }
    addTransactionDate(date: string){
      this.transactionDate = date
    }
    refreshValues(){
        this.transactionName = ""
        this.transactionType = "credit"
        this.transactionAmount = ""
        this.transactionCategory = ""
        this.transactionDate = ""
    }
    
}

export default Transaction
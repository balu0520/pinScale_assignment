import { makeObservable, observable } from 'mobx';
import { TransactionsList } from '../types/interfaces';

class TransactionObject {
    transactionName: string 
    transactionType: string 
    transactionCategory: string 
    transactionAmount: number | string 
    transactionDate: string
    constructor(transationName:string,transactionType:string, transactionCategory: string, transactionAmount: number | string, transactionDate: string) {
        makeObservable(this, {
            transactionName: observable,
            transactionType: observable,
            transactionCategory: observable,
            transactionAmount: observable,
            transactionDate: observable,
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
    addTransactionType(Ttype:string){
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
        this.transactionType = ""
        this.transactionAmount = ""
        this.transactionCategory = ""
        this.transactionDate = ""
    }
    
}

export default TransactionObject
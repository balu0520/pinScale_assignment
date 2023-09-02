import { makeObservable, observable } from 'mobx';
import {TransactionsList,TransactionItem} from '../types/interfaces'
import TransactionObject from './TransactionObject'


class TransactionStore{
    transactions: TransactionsList[] = []
    // transactionName: string = ""
    // transactionType: string = ""
    // transactionCategory: string = ""
    // transactionAmount: number | string = ""
    // transactionDate: string  = ""
    constructor(){
      makeObservable(this,{
        transactions:observable,
      })
    }
    addTransactions(newTransactions: TransactionsList[]){
      this.transactions = newTransactions
    }

    deleteNewTransaction(id: number){
        let index = this.transactions.findIndex(transaction => transaction.id === id )
        if(index !== -1){
            this.transactions.splice(index,1)
        } 
    }
    addNewTransaction(Item:TransactionItem){
        this.transactions.push(Item)
    }
    updateTransaction(Item:TransactionItem){
        let index = this.transactions.findIndex(transaction => transaction.id !== Item.id)
        if(index !== -1){
            this.transactions.splice(index,1,Item)
        }
    }
    // addTransactionName(name:string){
    //   this.transactionName = name
    // }
    // addTransactionType(Ttype:string){
    //   this.transactionType = Ttype
    // }
    // addTransactionCategory(category: string){
    //   this.transactionCategory = category
    // }
    // addTransactionAmount(amount: number | string){
    //   this.transactionAmount = Number(amount)
    // }
    // addTransactionDate(date: string){
    //   this.transactionDate = date
    // }
    
  }

export default TransactionStore
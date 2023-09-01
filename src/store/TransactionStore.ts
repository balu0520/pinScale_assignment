import { makeObservable, observable } from 'mobx';
import {TransactionsList,TransactionItem} from './../types/interfaces'

class TransactionStore{
    transactions: TransactionsList[] = []
    constructor(){
      makeObservable(this,{
        transactions:observable
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
    
  }

export default TransactionStore
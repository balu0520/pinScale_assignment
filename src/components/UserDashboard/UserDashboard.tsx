import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import './index.css'
import { useContext, useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { BallTriangle } from 'react-loader-spinner'
import DeletePopup from '../DeletePopup'
import AddPopup from '../AddPopup'
import UpdatePopup from '../UpdatePopup'
import useFetch from '../../hooks/useFetch'
import WeekCreditDebit from '../WeekCreditDebit'
import TotalCreditDebitItem from '../TotalCreditDebitItem'
import Transaction from '../../store/models/TransactionModel'
import { TransactionContext } from './../../context/transactionContext'
import { observer } from 'mobx-react'
import {useMachine} from '@xstate/react'
import { transactionMachine } from '../../machines/transactionMachine'
import { formatDate } from '../../utils/DateUtils'
import { sortTransactionsByDate } from '../../utils/SortUtils'


const UserDashboard = () => {
    const [cookie, _] = useCookies(["user_id"])
    const store = useContext(TransactionContext)
    const { fetchData} = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/all-transactions", method: 'GET', headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'user',
            'x-hasura-user-id': cookie.user_id
        }, params: {
            limit: 100,
            offset: 0
        }
    })
    const [load, setLoad] = useState(false)
    const navigate = useNavigate()
    const [state,send] = useMachine(transactionMachine,{
        services:{
            loadTransactions:async (context,event) => {
                const data = await fetchData()
                return new Promise((res,rej) => {
                    if(data !== null){
                        res(data.transactions) 
                    } 
                    if(data === null){
                        rej("Failed To fetch")
                    }    
                })
            }
        }
    })

    useEffect(() => {
        if (!cookie.user_id) {
            navigate("/login")
        } else if (cookie.user_id == 3) {
            navigate("/admin-dashboard")
        } else {
            setLoad(true)
        }
    }, [cookie.user_id])

    useEffect(() => {
        send({type:"fetch"})
    }, [])

    useEffect(() => {
        assignDataToStore()
    }, [state])

    const assignDataToStore = () => {
        if (state.matches("success")) {
            const newTransactions = sortTransactionsByDate(state.context.transactionList)
            let transactionObjArr:Transaction[] = []
            for(let sortedItem of newTransactions){
                let item = new Transaction(sortedItem.id,sortedItem.transaction_name,sortedItem.type,sortedItem.category,sortedItem.amount,String(sortedItem.date))
                transactionObjArr.push(item)
            }
            store?.setTransactions(transactionObjArr)
        }
    }



    const renderTransactionsLoadingView = () => (
        <div className='loader-container'>
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#2D60FF"
                ariaLabel="ball-triangle-loading"
                visible={true}
            />
        </div>
    )

    const renderTransactionSuccessView = () => {
        const transactions = store?.transactions.slice(0,3)
        const len = transactions?.length;
        if (len !== undefined) {
            return (
                <ul className='transactions-list'>
                    {transactions?.map((transaction, ind) => {
                        return (
                            <li key={transaction.transactionId}>
                                <div className='transaction-item'>
                                    <div className='transaction-name-container'>
                                        {transaction.transactionType.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/creditted_jcivrd.png' alt='creditted' />)}
                                        {transaction.transactionType.toLowerCase() === "debit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/debitted_smwzwr.png' alt='debitted' />)}
                                        <h1 className='transaction-name'>{transaction.transactionName}</h1>
                                    </div>
                                    <p className='transaction-category'>{transaction.transactionCategory}</p>
                                    <p className='transaction-date'>{formatDate(new Date(transaction.transactionDate))}</p>
                                    <p className={`transaction-amount ${transaction.transactionType.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.transactionType === "credit" ? '+' : '-'}$${transaction.transactionAmount}`}</p>
                                    <div className='update-delete-container'>
                                        <UpdatePopup transaction={transaction} />
                                        <DeletePopup transaction={transaction} />
                                    </div>
                                </div>
                                {ind !== len - 1 && (<hr className='separator' />)}
                            </li>
                        )
                    })}
                </ul>
            )
        }
        return (
            null
        )
    }

    const renderTransactionsFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
            <button onClick={() => send({type:"retry"})}>Retry</button>
        </div>
    )

    const renderTransactions = () => {
        switch (state.value) {
            case "success":
                return renderTransactionSuccessView();
            case "failed":
                return renderTransactionsFailureView();
            case "loading":
                return renderTransactionsLoadingView();
            default:
                return null
        }
    }

    return (
        <>
            {load && (
                <div className='user-container'>
                    <Sidebar activeId={0} />
                    <div className='dashboard-container'>
                        <div className='header-container'>
                            <h1 className='heading'>Account</h1>
                            <AddPopup />
                        </div>
                        <div className='dashboard-sub-container'>
                            <TotalCreditDebitItem url="https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals" method="GET" headers={{
                                'content-type': 'application/json',
                                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                                'x-hasura-role': 'user',
                                'x-hasura-user-id': cookie.user_id
                            }} />
                            <h1 className='last-transaction-heading'>Last Transaction</h1>
                            <div className='transaction-sub-container'>
                                {renderTransactions()}
                            </div>
                            <h1 className='last-transaction-heading'>Debit & Credit Overview</h1>
                            <WeekCreditDebit url="https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days" method="GET" headers={{
                                'content-type': 'application/json',
                                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                                'x-hasura-role': 'user',
                                'x-hasura-user-id': cookie.user_id
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default observer(UserDashboard)
import { useEffect, useState, useContext } from 'react'
import './index.css'
import { useCookies } from 'react-cookie';
import SideBar from '../Sidebar';
import { BallTriangle } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { TransactionsList } from '../../types/interfaces';
import { TransactionContext } from '../../context/transactionContext';
import { observer } from 'mobx-react';
import Transaction from '../../store/models/TransactionModel';
import {useMachine} from '@xstate/react'
import { transactionMachine } from '../../machines/transactionMachine'
import { formatDate } from '../../utils/DateUtils';
import { sortTransactionsByDate } from '../../utils/SortUtils';

const AdminTransactions = () => {
    const [activeId, setActiveId] = useState(0);
    const [load, setLoad] = useState(false)
    const store = useContext(TransactionContext)
    const [cookie, _] = useCookies(["user_id"])
    const { fetchData, resData } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/all-transactions", method: 'GET', headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'admin',
            'x-hasura-user-id': cookie.user_id
        },
        params: {
            limit: 100,
            offset: 0
        }
    })
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
        fetchAllTransactions(activeId);
        send({type:"fetch"})
    }, [])

    useEffect(() => {
        if (!cookie.user_id) {
            navigate("/login")
        } else if (cookie.user_id != 3) {
            navigate("/user-transactions")
        } else {
            setLoad(true)
        }
    }, [cookie.user_id])

    useEffect(() => {
        assignDataToStore();
    }, [state])

    const assignDataToStore = () => {
        if (resData !== null) {
            const newTransactions = sortTransactionsByDate(resData.transactions)
            newTransactions.forEach((transaction: TransactionsList, ind: number, arr: any) => {
                arr[ind] = new Transaction(transaction.id, transaction.transaction_name, transaction.type, transaction.category, transaction.amount, String(transaction.date))
            })
            store?.setTransactions(newTransactions)
        }
    }

    const fetchAllTransactions = async (id: number) => {
        setActiveId(id)
    }

    const renderAllTransactionsLoadingView = () => (
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

    const renderAllTransactionsFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
        </div>
    )

    const renderTransactionProfile = () => (
        <div className='admin-all-transactions-img-container'>
            <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690873427/admin-profiles_t49bxr.png' />
            <p className='admin-all-transaction-name'>user</p>
        </div>
    )

    const renderAllTransactionsSuccessView = () => {
        let transactions:Transaction[] | undefined = [] 
        if(activeId === 1){
            transactions = store?.transactionDebitList
        }else if(activeId === 2){
            transactions = store?.transactionCreditList
        } else {
            transactions = store?.transactionList
        }
        const len = transactions?.length;
        if (len !== undefined) {
            return (
                <ul className='admin-all-transactions-list'>
                    <li>
                        <div className='admin-all-transaction-item'>
                            <div className='admin-all-transaction-name-container'>
                                <h1 className='admin-all-transaction-name' style={{ color: '#343C6A' }}>username</h1>
                            </div>
                            <p className='admin-all-transaction-name' style={{ color: '#343C6A' }}>Transaction Name</p>
                            <p className='admin-all-transaction-category' style={{ color: '#343C6A' }}>Category</p>
                            <p className='admin-all-transaction-date' style={{ color: '#343C6A' }}>Date</p>
                            <p className="admin-all-transaction-amount" style={{ color: '#343C6A' }}>Amount </p>
                        </div>
                        <hr className='separator' />
                    </li>
                    {transactions?.map((transaction, ind) => (
                        <li key={transaction.transactionId}>
                            <div className='admin-all-transaction-item'>
                                <div className='admin-all-transaction-name-container'>
                                    {transaction.transactionType.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690869118/credit-no-clr_fxhpyy.png' alt='creditted' />)}
                                    {transaction.transactionType.toLowerCase() === "debit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690868931/debit-no-clr_yjqzmc.png' alt='debitted' />)}
                                    {renderTransactionProfile()}
                                </div>
                                <p className='admin-all-transaction-name'>{transaction.transactionName}</p>
                                <p className='admin-all-transaction-category'>{transaction.transactionCategory}</p>
                                <p className='admin-all-transaction-date'>{formatDate(new Date(transaction.transactionDate))}</p>
                                <p className={`admin-transaction-amount ${transaction.transactionType.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.transactionType.toLowerCase() === "credit" ? '+' : '-'}$${transaction.transactionAmount}`}</p>
                            </div>
                            {ind !== len - 1 && (<hr className='separator' />)}
                        </li>
                    ))}
                </ul>
            )
        }
        return (
            null
        )
    }

    const renderAllTransactions = () => {
        switch (state.value) {
            case "success":
                return renderAllTransactionsSuccessView()
            case "failed":
                return renderAllTransactionsFailureView()
            case "loading":
                return renderAllTransactionsLoadingView()
            default:
                return null
        }
    }

    return (
        <>
            {load && (
                <div className='admin-transaction-main-container'>
                    <SideBar activeId={1} />
                    <div className='admin-transaction-container'>
                        <div className='admin-all-transaction-header-container'>
                            <h1 className='admin-all-transaction-heading'>Transactions</h1>
                        </div>
                        <div className='admin-transaction-btn-container'>
                            <button className={`admin-transaction-btn ${activeId === 0 ? 'active-btn' : ''}`} onClick={() => fetchAllTransactions(0)}>All Transactions</button>
                            <button className={`admin-transaction-btn ${activeId === 1 ? 'active-btn' : ''}`} onClick={() => fetchAllTransactions(1)}>Debit</button>
                            <button className={`admin-transaction-btn ${activeId === 2 ? 'active-btn' : ''}`} onClick={() => fetchAllTransactions(2)}>Credit</button>
                        </div>
                        <div className='admin-all-transactions-container'>
                            <div className='admin-all-transactions-sub-container'>
                                {renderAllTransactions()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default observer(AdminTransactions)
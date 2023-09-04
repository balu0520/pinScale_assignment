import { useEffect, useState, useContext } from 'react'
import './index.css'
import { useCookies } from 'react-cookie';
import SideBar from '../Sidebar';
import { BallTriangle } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { DateOptions, TransactionsList } from '../../types/interfaces';
import { TransactionContext } from '../../context/transactionContext';
import { observer } from 'mobx-react';
import Transaction from '../../store/models/TransactionModel';

const AdminTransactions = () => {
    const [activeId, setActiveId] = useState(0);
    const [load, setLoad] = useState(false)
    const store = useContext(TransactionContext)
    const [cookie, _] = useCookies(["user_id"])
    const { fetchData, apiStatus, res_data } = useFetch({
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

    useEffect(() => {
        fetchAllTransactions(activeId);
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
        getData();
    }, [res_data])


    const filterTransactions = (transactions: TransactionsList[], id: number): any => {
        if (id === 0) {
            transactions.sort((a: TransactionsList, b: TransactionsList): number => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return dateB - dateA
            });
            return transactions
        } else if (id === 1) {
            const filteredTransactions = transactions.filter(transaction => transaction.type === "debit");
            filteredTransactions.sort((a: TransactionsList, b: TransactionsList): number => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return dateB - dateA
            });
            return filteredTransactions
        } else {
            const filteredTransactions = transactions.filter(transaction => transaction.type === "credit")
            filteredTransactions.sort((a: TransactionsList, b: TransactionsList): number => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return dateB - dateA
            });
            return filteredTransactions
        }
    }

    const getData = () => {
        if (res_data !== null) {
            const newTransactions = filterTransactions(res_data.transactions, activeId)
            newTransactions.forEach((transaction: TransactionsList, ind: number, arr: any) => {
                arr[ind] = new Transaction(transaction.id, transaction.transaction_name, transaction.type, transaction.category, transaction.amount, String(transaction.date))
            })
            store?.setTransactions(newTransactions)
        }
    }

    const fetchAllTransactions = async (id: number) => {
        setActiveId(id)
        await fetchData();
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

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const options: DateOptions = {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        return date.toLocaleString('en-US', options);
    }


    const renderTransactionProfile = () => (
        <div className='admin-all-transactions-img-container'>
            <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690873427/admin-profiles_t49bxr.png' />
            <p className='admin-all-transaction-name'>user</p>
        </div>
    )

    const renderAllTransactionsSuccessView = () => {
        const transactions = store?.transactions
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
        switch (apiStatus) {
            case "SUCCESS":
                return renderAllTransactionsSuccessView()
            case "FAILURE":
                return renderAllTransactionsFailureView()
            case "IN_PROGRESS":
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
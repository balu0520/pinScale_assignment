import { useEffect, useState,useContext } from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import SideBar from '../Sidebar'
import AddPopup from '../AddPopup'
import { BallTriangle } from 'react-loader-spinner'
import useFetch from '../../hooks/useFetch'
import WeekCreditDebit from '../WeekCreditDebit'
import TotalCreditDebitItem from '../TotalCreditDebitItem'
import { observer } from 'mobx-react'
import { DateOptions,TransactionItem,TransactionsList } from '../../types/interfaces'
import { TransactionContext } from '../../context/transactionContext'
import Transaction from '../../store/models/TransactionModel'

const AdminDashboard = () => {
    const [cookie, _] = useCookies(["user_id"])
    const store = useContext(TransactionContext)
    const { fetchData, apiStatus, res_data } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/all-transactions", method: 'GET', headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'admin',
            'x-hasura-user-id': cookie.user_id
        }, params: {
            limit: 100,
            offset: 0
        }
    })
    const [load, setLoad] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!cookie.user_id) {
            navigate("/login")
        } else if (cookie.user_id != 3) {
            navigate("user-dashboard")
        } else {
            setLoad(true)
        }
    }, [cookie.user_id])

    useEffect(() => {
        fetchTransactions();
    }, [])

    useEffect(() => {
        getData();
    }, [res_data])

    const getData = () => {
        if (res_data !== null) {
            const newTransactions = res_data.transactions;
            newTransactions.sort((a:TransactionItem,b:TransactionItem) => {
                const dateA = new Date(a.date).getTime()
                const dateB = new Date(b.date).getTime()
                return dateB-dateA
            })
            const sortedNewTransactions = newTransactions.slice(0, 3)
            sortedNewTransactions.forEach((transaction: TransactionsList, ind: number, arr: any) => {
                arr[ind] = new Transaction(transaction.id, transaction.transaction_name, transaction.type, transaction.category, transaction.amount, String(transaction.date))
            })
            store?.setTransactions(sortedNewTransactions)
        }
    }


    const fetchTransactions = async (id?:number) => {
        await fetchData()
    }

    const formatDate = (dateString:Date) => {
        const date = new Date(dateString);
        const options:DateOptions = {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        return date.toLocaleString('en-US', options);
    }

    const renderTransactionsLoadingView = () => (
        <div className='admin-loader-container'>
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
        const transactions = store?.transactions
        const len = transactions?.length;
        if(len !== undefined){
            return (
                <ul className='admin-transactions-list'>
                    {transactions?.map((transaction, ind) => (
                        <li key={transaction.transactionId}>
                            <div className='admin-transaction-item'>
                                <div className='admin-transaction-name-container'>
                                    {transaction.transactionType.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/creditted_jcivrd.png' alt='creditted' />)}
                                    {transaction.transactionType.toLowerCase() === "debit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/debitted_smwzwr.png' alt='debitted' />)}
                                    <div className='admin-transaction-img-container'>
                                        <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690873427/admin-profiles_t49bxr.png' />
                                        <p className='admin-transaction-img-container-para'>Arlene McCoy</p>
                                    </div>
                                </div>
                                <p className='admin-transaction-name'>{transaction.transactionName}</p>
                                <p className='admin-transaction-category'>{transaction.transactionCategory}</p>
                                <p className='admin-transaction-date'>{formatDate(new Date(transaction.transactionDate))}</p>
                                <p className={`admin-transaction-amount ${transaction.transactionType.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.transactionType === "credit" ? '+' : '-'}$${transaction.transactionAmount}`}</p>
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

    const renderTransactionsFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
        </div>
    )

    const renderTransactions = () => {
        switch (apiStatus) {
            case "SUCCESS":
                return renderTransactionSuccessView();
            case "FAILURE":
                return renderTransactionsFailureView();
            case "IN_PROGRESS":
                return renderTransactionsLoadingView();
            default:
                return null
        }
    }

    return (
        <>
            {load && (
                <div className='admin-container'>
                    <SideBar activeId={0} />
                    <div className='admin-dashboard-container'>
                        <div className='admin-header-container'>
                            <h1 className='admin-heading'>Account</h1>
                            <AddPopup reloadOperation={fetchTransactions} id={-1} />
                        </div>
                        <div className='admin-dashboard-sub-container'>
                            <TotalCreditDebitItem url="https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin" method="GET" headers={{
                                'content-type': 'application/json',
                                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                                'x-hasura-role': 'admin'
                            }} />
                            <h1 className='admin-last-transaction-heading'>Last Transaction</h1>
                            <div className='admin-transaction-sub-container'>
                                {renderTransactions()}
                            </div>
                            <h1 className='admin-last-transaction-heading'>Debit & Credit Overview</h1>
                            <WeekCreditDebit url="https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-last-7-days-admin" method="GET" headers={{
                                'content-type': 'application/json',
                                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                                'x-hasura-role': 'admin',
                            }} />

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default observer(AdminDashboard)
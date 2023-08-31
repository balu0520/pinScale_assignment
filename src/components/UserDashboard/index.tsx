import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import './index.css'
import { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { BallTriangle } from 'react-loader-spinner'
import DeletePopup from '../DeletePopup'
import AddPopup from '../AddPopup'
import UpdatePopup from '../UpdatePopup'
import useFetch from '../../hooks/useFetch'
import WeekCreditDebit from '../WeekCreditDebit'
import TotalCreditDebitItem from '../TotalCreditDebitItem'


interface Options {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
}

interface TransactionItems {
    id:number
    transaction_name:string,
    type:string,
    amount:number,
    category:string
    date: Date,
}


const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}


const UserDashboard = () => {
    const [cookie, _] = useCookies(["user_id"])
    const [transactions, setTransaction] = useState<TransactionItems[]>([])
    const { fetchData, res_data, apiStatus } = useFetch({
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
        fetchTransactions();
    }, [])

    useEffect(() => {
        getData()
    }, [res_data])

    const getData = () => {
        if (res_data !== null) {
            const newTransactions = res_data.transactions;
            // newTransactions.sort((a:Transaction, b:Transaction):number => {
            //     const dateA = new Date(a.date).getTime()
            //     const dateB = new Date(b.date).getTime()
            //     return dateB-dateA
            // });
            // console.log(newTransactions)
            const sortedNewTransactions = newTransactions.slice(0, 3)
            setTransaction(sortedNewTransactions)
        }
    }


    const fetchTransactions = async () => {
        await fetchData();
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
                // wrapperClass={{}}
                // wrapperStyle=""
            />
        </div>
    )

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const options: Options = {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        return date.toLocaleString('en-US', options);
    }

    const renderTransactionSuccessView = () => {
        const len = transactions.length;
        return (
            <ul className='transactions-list'>
                {transactions.map((transaction, ind) => {
                    return (
                        <li key={transaction.id}>
                            <div className='transaction-item'>
                                <div className='transaction-name-container'>
                                    {transaction.type.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/creditted_jcivrd.png' alt='creditted' />)}
                                    {transaction.type.toLowerCase() === "debit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/debitted_smwzwr.png' alt='debitted' />)}
                                    <h1 className='transaction-name'>{transaction.transaction_name}</h1>
                                </div>
                                <p className='transaction-category'>{transaction.category}</p>
                                <p className='transaction-date'>{formatDate(transaction.date)}</p>
                                <p className={`transaction-amount ${transaction.type.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.type === "credit" ? '+' : '-'}$${transaction.amount}`}</p>
                                <div className='update-delete-container'>
                                    <UpdatePopup transaction={transaction} reloadOperation={fetchTransactions} id={-1} />
                                    <DeletePopup transaction={transaction} reloadOperation={fetchTransactions} id={-1} />
                                </div>
                            </div>
                            {ind !== len - 1 && (<hr className='separator' />)}
                        </li>
                    )
                })}
            </ul>
        )
    }

    const renderTransactionsFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
        </div>
    )

    const renderTransactions = () => {
        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderTransactionSuccessView();
            case apiStatusConstants.failure:
                return renderTransactionsFailureView();
            case apiStatusConstants.inProgress:
                return renderTransactionsLoadingView();
            default:
                return null
        }
    }

    return (
        <>
            {load && (
                <div className='container'>
                    <Sidebar activeId={0} />
                    <div className='dashboard-container'>
                        <div className='header-container'>
                            <h1 className='heading'>Account</h1>
                            <AddPopup reloadOperation={fetchTransactions} id={-1} />
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

export default UserDashboard
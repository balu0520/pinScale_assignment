import { useEffect, useState } from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import SideBar from '../Sidebar'
import AddPopup from '../AddPopup'
import { BallTriangle } from 'react-loader-spinner'
import { useFetch } from '../../hooks/useFetch'
import WeekCreditDebit from '../WeekCreditDebit'
import TotalCreditDebitItem from '../TotalCreditDebitItem'

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}

const AdminDashboard = () => {
    const [cookie, _] = useCookies(["user_id"])
    const [transactions, setTransaction] = useState([])
    const { fetchHook, apiStatus } = useFetch({
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


    const fetchTransactions = async () => {
        try {
            const response = await fetchHook()
            if (response.ok === true) {
                const data = await response.json()
                const newTransactions = data.transactions;
                newTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                const sortedNewTransactions = newTransactions.slice(0, 3)
                setTransaction(sortedNewTransactions)
            }
        } catch (err) {
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
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
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </div>
    )

    const renderTransactionSuccessView = () => {
        const len = transactions.length;
        return (
            <ul className='admin-transactions-list'>
                {transactions.map((transaction, ind) => (
                    <li key={transaction.id}>
                        <div className='admin-transaction-item'>
                            <div className='admin-transaction-name-container'>
                                {transaction.type.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/creditted_jcivrd.png' alt='creditted' />)}
                                {transaction.type.toLowerCase() === "debit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690724471/debitted_smwzwr.png' alt='debitted' />)}
                                <div className='admin-transaction-img-container'>
                                    <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690873427/admin-profiles_t49bxr.png' />
                                    <p className='admin-transaction-img-container-para'>Arlene McCoy</p>
                                </div>
                            </div>
                            <p className='admin-transaction-name'>{transaction.transaction_name}</p>
                            <p className='admin-transaction-category'>{transaction.category}</p>
                            <p className='admin-transaction-date'>{formatDate(transaction.date)}</p>
                            <p className={`admin-transaction-amount ${transaction.type.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.type === "credit" ? '+' : '-'}$${transaction.amount}`}</p>
                        </div>
                        {ind !== len - 1 && (<hr className='separator' />)}
                    </li>
                ))}
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

export default AdminDashboard
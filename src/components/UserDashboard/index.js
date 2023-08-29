import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import './index.css'
import { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { BallTriangle } from 'react-loader-spinner'
import DeletePopup from '../DeletePopup'
import AddPopup from '../AddPopup'
import UpdatePopup from '../UpdatePopup'
import { useFetch } from './../../hooks/useFetch'
import WeekCreditDebit from '../WeekCreditDebit'
import TotalCreditDebitItem from '../TotalCreditDebitItem'



const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}


const UserDashboard = () => {
    const [cookie, _] = useCookies(["user_id"])
    const [transactions, setTransaction] = useState([])
    const { fetchHook, apiStatus } = useFetch({
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


    const fetchTransactions = async () => {
        const response = await fetchHook();
        if (response.ok === true) {
            const data = await response.json()
            const newTransactions = data.transactions;
            newTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            const sortedNewTransactions = newTransactions.slice(0, 3)
            setTransaction(sortedNewTransactions)
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
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </div>
    )

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

    const renderTransactionSuccessView = () => {
        const len = transactions.length;
        return (
            <ul className='transactions-list'>
                {transactions.map((transaction, ind) => (
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
                                {/* <div className='type-container'>
                                <div className='credit-debit-container'>
                                    <div>
                                        <h1 className='credit-heading'>${totalCredit}</h1>
                                        <p className='credit-para'>credit</p>
                                    </div>
                                    <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690714183/credit_jbbub1.png' className='type-img' alt='credit' />
                                </div>
                                <div className='credit-debit-container'>
                                    <div>
                                        <h1 className='debit-heading'>${totalDebit}</h1>
                                        <p className='debit-para'>Debit</p>
                                    </div>
                                    <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690714183/Debit_hh7uxj.png' className='type-img' alt='debit' />
                                </div>
                            </div> */}
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
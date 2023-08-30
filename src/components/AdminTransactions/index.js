import { useEffect, useState } from 'react'
import './index.css'
import { useCookies } from 'react-cookie';
import SideBar from '../Sidebar';
import { BallTriangle } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const usernames = [
    { user_id: 1, username: "janedoe" }, { user_id: 2, username: "samsmith" }, { user_id: 4, username: "rahul" },
    { user_id: 5, username: "teja" }, { user_id: 6, username: "loki" }, { user_id: 7, username: "ramesh" },
    { user_id: 8, username: "suresh" }, { user_id: 9, username: "prem" }, { user_id: 10, username: "piyush" },
    { user_id: 12, username: "isha" }, { user_id: 14, username: "seema" }, { user_id: 15, username: "seema" },
    { user_id: 16, username: "radha" }, { user_id: 17, username: "phani" }
]

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}

const AdminTransactions = () => {
    const [activeId, setActiveId] = useState(0);
    const [load, setLoad] = useState(false)
    const [transactions, setTransactions] = useState([])
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
    },[res_data])


    const filterTransactions = (transactions, id) => {
        if (id === 0) {
            transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            return transactions
        } else if (id === 1) {
            const filteredTransactions = transactions.filter(transaction => transaction.type === "debit");
            filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            return filteredTransactions
        } else {
            const filteredTransactions = transactions.filter(transaction => transaction.type === "credit")
            filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            return filteredTransactions
        }
    }

    const getData = () => {
        try {
            if (res_data !== null) {
                const newTransactions = filterTransactions(res_data.transactions, activeId)
                setTransactions(newTransactions)
            }
        } catch (err) {

        }
    }

    const fetchAllTransactions = async id => {
        setActiveId(id)
        try {
            await fetchData();
        } catch (err) {

        }
    }

    const renderAllTransactionsLoadingView = () => (
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

    const renderAllTransactionsFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
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

    const getUsername = userId => {
        const User = usernames.find((user) => user.user_id === userId);
        return User ? User.username : null;
    }

    const renderTransactionProfile = userId => {
        const user = getUsername(userId)
        return (
            <div className='admin-all-transactions-img-container'>
                <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690873427/admin-profiles_t49bxr.png' />
                <p className='admin-all-transaction-name'>{user}</p>
            </div>
        )

    }

    const renderAllTransactionsSuccessView = () => {
        const len = transactions.length;
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
                {transactions.map((transaction, ind) => (
                    <li key={transaction.id}>
                        <div className='admin-all-transaction-item'>
                            <div className='admin-all-transaction-name-container'>
                                {transaction.type.toLowerCase() === "credit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690869118/credit-no-clr_fxhpyy.png' alt='creditted' />)}
                                {transaction.type.toLowerCase() === "debit" && (<img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690868931/debit-no-clr_yjqzmc.png' alt='debitted' />)}
                                {renderTransactionProfile(transaction.user_id)}
                            </div>
                            <p className='admin-all-transaction-name'>{transaction.transaction_name}</p>
                            <p className='admin-all-transaction-category'>{transaction.category}</p>
                            <p className='admin-all-transaction-date'>{formatDate(transaction.date)}</p>
                            <p className={`admin-transaction-amount ${transaction.type.toLowerCase() === "credit" ? 'credit' : 'debit'}`}>{`${transaction.type.toLowerCase() === "credit" ? '+' : '-'}$${transaction.amount}`}</p>
                        </div>
                        {ind !== len - 1 && (<hr className='separator' />)}
                    </li>
                ))}
            </ul>
        )
    }

    const renderAllTransactions = () => {
        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderAllTransactionsSuccessView()
            case apiStatusConstants.failure:
                return renderAllTransactionsFailureView()
            case apiStatusConstants.inProgress:
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

export default AdminTransactions
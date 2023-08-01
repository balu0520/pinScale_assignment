import { useEffect, useState } from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
import BarChart from '../BarChart'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import SideBar from '../Sidebar'
import AddPopup from '../AddPopup'
import { BallTriangle } from 'react-loader-spinner'

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}

const AdminDashboard = () => {
    const [cookie, _] = useCookies(["user_id"])
    const [transactions, setTransaction] = useState([])
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [apiStatusOne, setApiStatusOne] = useState(apiStatusConstants.initial)
    const [load, setLoad] = useState(false)
    const [total7, setTotal7] = useState([])
    const [weekCredit,setWeekCredit] = useState(0);
    const [weekDebit, setWeekDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState("");
    const [totalDebit, setTotalDebit] = useState("")
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
        fetchAllDebitAndCredit();
        fetchLast7DaysCreditDebit();
    }, [])

    const getWeekCreditDebit = weekCreditDebitTransactions => {
        let newWeekCredit = 0;
        let newWeekDebit = 0;
        for(let item of weekCreditDebitTransactions){
            if(item.type.toLowerCase() === "credit"){
                newWeekCredit += item.sum;
            }
            if(item.type.toLowerCase() === "debit"){
                newWeekDebit += item.sum;
            }
        }
        return ({weekCredit:newWeekCredit,weekDebit:newWeekDebit})
    }

    const fetchLast7DaysCreditDebit = async () => {
        setApiStatusOne(apiStatusConstants.inProgress)
        const url = "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-last-7-days-admin";
        const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'admin',
            }
        }
        try {
            const response = await fetch(url, options);
            if (response.ok === true) {
                const data = await response.json();
                const last7DaysTransactionsCreditDebitTotals = data.last_7_days_transactions_totals_admin;
                const {weekCredit,weekDebit} = getWeekCreditDebit(last7DaysTransactionsCreditDebitTotals)
                setWeekCredit(weekCredit)
                setWeekDebit(weekDebit)
                setTotal7(last7DaysTransactionsCreditDebitTotals)
                setApiStatusOne(apiStatusConstants.success)
            } else {
                setApiStatusOne(apiStatusConstants.failure)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getTotalCreditDebit = newTransactions => {
        let newTotalCredit = 0;
            let newTotalDebit = 0;
            for (let item of newTransactions) {
                if (item.type.toLowerCase() === "credit") {
                    newTotalCredit += item.sum;
                }
                if (item.type.toLowerCase() === "debit") {
                    newTotalDebit += item.sum;
                }
            }
            return ({ totalCredit: newTotalCredit, totalDebit: newTotalDebit })
    }


    const fetchTransactions = () => {
        setApiStatus(apiStatusConstants.inProgress)
        const url = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions"
        const params = {
            limit: 100,
            offset: 0
        }
        axios.get(url, {
            params: params,
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'admin',
                'x-hasura-user-id': cookie.user_id
            },
        }).then(response => {
            if (response.status === 200) {
                const newTransactions = response.data.transactions;
                newTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                const sortedNewTransactions = newTransactions.slice(0,3)
                setTransaction(sortedNewTransactions)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }


    const fetchAllDebitAndCredit = () => {
        const url = "https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin"
        axios.get(url, {
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'admin'
            },
        }).then(response => {
            if (response.status === 200) {
                const totalCreditDebitTransactions = response.data.transaction_totals_admin;
                const { totalCredit, totalDebit } = getTotalCreditDebit(totalCreditDebitTransactions)
                setTotalCredit(totalCredit)
                setTotalDebit(totalDebit)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        }).catch(error => {
            console.error('Error:', error);
        });
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
        // console.log(transactions)
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
                            <p className='admin-transaction-category'>{transaction.transaction_name}</p>
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
        switch (apiStatusOne) {
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

    const renderBarChartSuccessView = () => (
        <BarChart total7={total7} />
    )

    const renderBarChart = () => {
        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderBarChartSuccessView();
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
                    <SideBar activeId={0} />
                    <div className='admin-dashboard-container'>
                        <div className='admin-header-container'>
                            <h1 className='admin-heading'>Account</h1>
                            <AddPopup reloadOperation={fetchAllDebitAndCredit} id={-1} />
                        </div>
                        <div className='admin-dashboard-sub-container'>
                            <div className='admin-type-container'>
                                <div className='admin-credit-debit-container'>
                                    <div>
                                        <h1 className='admin-credit-heading'>${totalCredit}</h1>
                                        <p className='admin-credit-para'>credit</p>
                                    </div>
                                    <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690714183/credit_jbbub1.png' className='type-img' alt='credit' />
                                </div>
                                <div className='admin-credit-debit-container'>
                                    <div>
                                        <h1 className='admin-debit-heading'>${totalDebit}</h1>
                                        <p className='admin-debit-para'>Debit</p>
                                    </div>
                                    <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690714183/Debit_hh7uxj.png' className='type-img' alt='debit' />
                                </div>
                            </div>
                            <h1 className='admin-last-transaction-heading'>Last Transaction</h1>
                            {renderTransactions()}
                            <h1 className='admin-last-transaction-heading'>Debit & Credit Overview</h1>
                            <div className='admin-overview-container'>
                                <div className='admin-overview-sub-container'>
                                    <h1 className='admin-overview-heading'><span style={{ color: "#333B69" }}>${weekDebit}</span> Debited & <span style={{ color: "#333B69" }}>${weekCredit}</span> Credited in this Week</h1>
                                    <div className='admin-overview-sub-container-1'>
                                        <div className='admin-overview-sub-container-2'>
                                            <button className='admin-overview-btn-1'></button>
                                            <p className='admin-overview-para'>Debit</p>
                                        </div>
                                        <div className='admin-overview-sub-container-2'>
                                            <button className='admin-overview-btn-2'></button>
                                            <p className='admin-overview-para'>Credit</p>
                                        </div>
                                    </div>
                                </div>
                                {renderBarChart()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminDashboard
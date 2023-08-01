import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import './index.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../Sidebar'
import { BallTriangle } from 'react-loader-spinner'
import DeletePopup from '../DeletePopup'
import AddPopup from '../AddPopup'
import UpdatePopup from '../UpdatePopup'
import BarChart from '../BarChart'


const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}


const UserDashboard = () => {
    const [cookie, _] = useCookies(["user_id"])
    const [transactions, setTransaction] = useState([])
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [apiStatusOne,setApiStatusOne] = useState(apiStatusConstants.initial)
    const [load, setLoad] = useState(false)
    const [total7,setTotal7] = useState([])
    const [weekCredit, setWeekCredit] = useState("");
    const [weekDebit, setWeekDebit] = useState("");
    const [totalCredit, setTotalCredit] = useState("");
    const [totalDebit, setTotalDebit] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        if (!cookie.user_id) {
            navigate("/login")
        } else if(cookie.user_id == 3){
            navigate("/admin-dashboard")
        } else {
            setLoad(true)
        }
    }, [cookie.user_id])

    if (cookie.user_id === 3) {
        navigate("/admin-dashboard")
    }

    useEffect(() => {
        fetchTransactions();
        fetchAllDebitAndCredit();
        fetchLast7DaysCreditDebit();
    }, [])

    const fetchLast7DaysCreditDebit = async () => {
        setApiStatusOne(apiStatusConstants.inProgress)
        const url = "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days";
        const options={
            method:'GET',
            headers:{
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'user',
                'x-hasura-user-id': cookie.user_id
            }
        }
        try{
            const response = await fetch(url,options);
            if(response.ok === true){
                const data = await response.json();
                const last7DaysTransactionsCreditDebitTotals = data.last_7_days_transactions_credit_debit_totals;
                setTotal7(last7DaysTransactionsCreditDebitTotals)

                setApiStatusOne(apiStatusConstants.success)
            } else {
                setApiStatusOne(apiStatusConstants.failure)
            }
        } catch(err){
            console.error(err)
        }
    }

    const getCreditDebit = weekCreditDebitTransactions => {
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

    const getTotalCreditDebitTransactions = newTransactions => {
        let newTotalCredit = 0;
        let newTotalDebit = 0;
        for(let item of newTransactions){
            if(item.type.toLowerCase() === "credit"){
                newTotalCredit += item.amount;
            }
            if(item.type.toLowerCase() === "debit"){
                newTotalDebit += item.amount;
            }
        }
        return ({totalCredit:newTotalCredit,totalDebit:newTotalDebit})
    }

    const fetchAllDebitAndCredit = () => {
        const url = "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals"
        axios.get(url, {
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'user',
                'x-hasura-user-id': cookie.user_id
            },
        }).then(response => {
            if (response.status === 200) {
                const weekCreditDebitTransactions = response.data.totals_credit_debit_transactions;
                const {weekCredit,weekDebit} = getCreditDebit(weekCreditDebitTransactions)
                setWeekCredit(weekCredit)
                setWeekDebit(weekDebit)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        }).catch(error => {
            console.error('Error:', error);
        });
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
                'x-hasura-role': 'user',
                'x-hasura-user-id': cookie.user_id
            },
        }).then(response => {
            if (response.status === 200) {
                const newTransactions = response.data.transactions;
                const {totalCredit,totalDebit} = getTotalCreditDebitTransactions(newTransactions)
                newTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                const sortedNewTransactions = newTransactions.slice(0,3)
                setTotalCredit(totalCredit)
                setTotalDebit(totalDebit)
                setTransaction(sortedNewTransactions)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        }).catch(error => {
            console.error('Error:', error);
        });
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
                                <UpdatePopup transaction={transaction} reloadOperation={fetchTransactions} id={-1}/>
                                <DeletePopup transaction={transaction} reloadOperation={fetchTransactions} id={-1}/>
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

    const renderBarChartSuccessView = () => (
        <BarChart total7={total7} />
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
            <Sidebar activeId={0} />
            <div className='dashboard-container'>
                <div className='header-container'>
                    <h1 className='heading'>Account</h1>
                    <AddPopup reloadOperation={fetchTransactions} id={-1}/>
                </div>
                <div className='dashboard-sub-container'>
                    <div className='type-container'>
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
                    </div>
                    <h1 className='last-transaction-heading'>Last Transaction</h1>
                    {renderTransactions()}
                    <h1 className='last-transaction-heading'>Debit & Credit Overview</h1>
                    <div className='overview-container'>
                        <div className='overview-sub-container'>
                            <h1 className='overview-heading'><span style={{color:"#333B69"}}>{weekDebit}</span> Debited & <span style={{color:"#333B69"}}>{weekCredit}</span> Credited in this Week</h1>
                            <div className='overview-sub-container-1'>
                                <div className='overview-sub-container-2'>
                                    <button className='overview-btn-1'></button>
                                    <p className='overview-para'>Debit</p>
                                </div>
                                <div className='overview-sub-container-2'>
                                    <button className='overview-btn-2'></button>
                                    <p className='overview-para'>Credit</p>
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


export default UserDashboard
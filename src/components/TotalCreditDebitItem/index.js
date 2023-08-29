import { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { BallTriangle } from "react-loader-spinner";
import BarGraph from '../BarGraph'
import './index.css'
import { useCookies } from 'react-cookie';

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}

const TotalCreditDebitItem = props => {
    const [cookie, _] = useCookies(['user_id'])
    const { url, method, headers } = props
    const { fetchHook, apiStatus } = useFetch({ url, method, headers })
    const [totalCredit, setTotalCredit] = useState("");
    const [totalDebit, setTotalDebit] = useState("");

    useEffect(() => {
        fetchAllDebitAndCredit();
    }, [])

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

    const fetchAllDebitAndCredit = async () => {
        try {
            const response = await fetchHook();
            if (response.ok === true) {
                const data = await response.json();
                let totalCreditDebitTransactions = null
                if (cookie.user_id == 3) {
                    totalCreditDebitTransactions = data.transaction_totals_admin;
                } else {
                    totalCreditDebitTransactions = data.totals_credit_debit_transactions
                }
                const { totalCredit, totalDebit } = getTotalCreditDebit(totalCreditDebitTransactions)
                setTotalCredit(totalCredit)
                setTotalDebit(totalDebit)
            }
        } catch (err) {
            // console.error(err)
        }
    }

    const renderTotalCreditDebitItemFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
        </div>
    )

    const renderTotalCreditDebitItemLoadingView = () => (
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

    const renderTotalCreditDebitItemSuccessView = () => (
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
    )

    const renderTotalCreditDebitItem = () => {
        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderTotalCreditDebitItemSuccessView();
            case apiStatusConstants.failure:
                return renderTotalCreditDebitItemFailureView();
            case apiStatusConstants.inProgress:
                return renderTotalCreditDebitItemLoadingView();
            default:
                return null
        }
    }

    return (
        <>
            {renderTotalCreditDebitItem()}
        </>
    )
}

export default TotalCreditDebitItem
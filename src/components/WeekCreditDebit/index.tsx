import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { BallTriangle } from "react-loader-spinner";
import './index.css'
import { useCookies } from "react-cookie";
import BarGraph from "../BarGraph";

interface WeekCreditDebit {
    url: string,
    method: string,
    headers: HeadersInit,
}

interface WeekCreditDebitItem {
    type: string,
    sum: number
}
interface Week7Transaction {
    date: Date,
    type: string,
    sum: number
}
interface WeekCreditDebitResult {
    weekCredit: number,
    weekDebit: number
}


const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}

const WeekCreditDebit = (props: WeekCreditDebit) => {
    const [cookie, _] = useCookies(['user_id'])
    const [total7, setTotal7] = useState<Week7Transaction[]>([])
    const [weekCredit, setWeekCredit] = useState<number | string>("")
    const [weekDebit, setWeekDebit] = useState<number | string>("")
    const { url, method, headers } = props
    const { fetchData, apiStatus, res_data } = useFetch({ url, method, headers })

    useEffect(() => {
        fetchLast7DaysCreditDebit()
    }, [])

    useEffect(() => {
        getData()
    }, [res_data])

    const getCreditDebit = (weekCreditDebitTransactions: WeekCreditDebitItem[]): WeekCreditDebitResult => {
        let newWeekCredit = 0;
        let newWeekDebit = 0;
        for (let item of weekCreditDebitTransactions) {
            if (item.type.toLowerCase() === "credit") {
                newWeekCredit += item.sum;
            }
            if (item.type.toLowerCase() === "debit") {
                newWeekDebit += item.sum;
            }
        }
        return ({ weekCredit: newWeekCredit, weekDebit: newWeekDebit })
    }

    const getData = () => {
        if (res_data !== null) {
            let last7DaysTransactionsCreditDebitTotals:Week7Transaction[]
            if (cookie.user_id == 3) {
                last7DaysTransactionsCreditDebitTotals = res_data.last_7_days_transactions_totals_admin;
            } else {
                last7DaysTransactionsCreditDebitTotals = res_data.last_7_days_transactions_credit_debit_totals;
            }
            const { weekCredit, weekDebit } = getCreditDebit(last7DaysTransactionsCreditDebitTotals)
            setWeekCredit(weekCredit)
            setWeekDebit(weekDebit)
            setTotal7(last7DaysTransactionsCreditDebitTotals)
        }
    }

    const fetchLast7DaysCreditDebit = async () => {
        await fetchData();
    }

    const renderWeekCreditDebitLoadingView = () => (
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

    const renderWeekCreditDebitFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
        </div>
    )

    const renderWeekCreditDebitSuccessView = () => {
       let totalProps:Week7Transaction[] = [...total7]
        return (
            <div className='overview-container'>
                <div className='overview-sub-container'>
                    <h1 className='overview-heading'><span style={{ color: "#333B69" }}>{weekDebit}</span> Debited & <span style={{ color: "#333B69" }}>{weekCredit}</span> Credited in this Week</h1>
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
                <BarGraph total7={totalProps} />
            </div>
        )
    }

    const renderWeekCreditDebit = () => {
        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderWeekCreditDebitSuccessView();
            case apiStatusConstants.failure:
                return renderWeekCreditDebitFailureView();
            case apiStatusConstants.inProgress:
                return renderWeekCreditDebitLoadingView();
            default:
                return null
        }
    }


    return (
        <>
            {renderWeekCreditDebit()}
        </>
    )
}

export default WeekCreditDebit
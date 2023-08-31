import { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { BallTriangle } from "react-loader-spinner";
import './index.css'
import { useCookies } from 'react-cookie';

// url="https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals" method="GET" headers={{
//                                 'content-type': 'application/json',
//                                 'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
//                                 'x-hasura-role': 'user',
//                                 'x-hasura-user-id': cookie.user_id

interface TotalCreditDebit {
    url: string,
    method: string,
    headers: HeadersInit,
}

interface TransactionItem {
    type:string,
    sum:number
}
interface TransactionItemResult{
    totalCredit:number,
    totalDebit:number
}

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}

const TotalCreditDebitItem = (props: TotalCreditDebit) => {
    const [cookie, _] = useCookies(['user_id'])
    const { url, method, headers } = props
    const { fetchData, res_data, apiStatus } = useFetch({ url, method, headers })
    const [totalCredit, setTotalCredit] = useState<number | string>("");
    const [totalDebit, setTotalDebit] = useState<number | string>("");

    useEffect(() => {
        fetchAllDebitAndCredit();
    }, [])

    useEffect(() => {
        getData()
    }, [res_data])

    const getTotalCreditDebit = (newTransactions:TransactionItem[]): TransactionItemResult => {
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

    const getData = () => {
        if (res_data !== null) {
            let totalCreditDebitTransactions = null
            if (cookie.user_id == 3) {
                totalCreditDebitTransactions = res_data.transaction_totals_admin;
            } else {
                totalCreditDebitTransactions = res_data.totals_credit_debit_transactions
            }
            const { totalCredit, totalDebit } = getTotalCreditDebit(totalCreditDebitTransactions)
            setTotalCredit(totalCredit)
            setTotalDebit(totalDebit)
        }
    }

    const fetchAllDebitAndCredit = async () => {
        await fetchData();
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
                visible={true}
                // wrapperClass={{}}
                // wrapperStyle=""
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
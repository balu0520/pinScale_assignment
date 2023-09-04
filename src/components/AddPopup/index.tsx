import Popup from "reactjs-popup";
import './index.css'
import { useState, useContext } from "react";
import { useCookies } from "react-cookie";
import useFetch from "../../hooks/useFetch";
import { AddPopupProps, TransactionType } from "../../types/interfaces";
import { TransactionContext } from "../../context/transactionContext";
import { observer } from "mobx-react";
import Transaction from "../../store/models/TransactionModel";
const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

const AddPopup = (props: AddPopupProps) => {
    const { reloadOperation, id } = props
    const [cookie, _] = useCookies(["user_id"])
    const store = useContext(TransactionContext)
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [transactionObj, __] = useState(new Transaction("", "credit", "", "", ""))
    const { fetchData, res_error, res_data } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/add-transaction", method: "POST", headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'user',
            'x-hasura-user-id': cookie.user_id
        }, body: {
            name: transactionObj.transactionName,
            type: transactionObj.transactionType,
            category: transactionObj.transactionCategory,
            amount: transactionObj.transactionAmount,
            date: transactionObj.transactionDate,
            user_id: cookie.user_id
        }
    })

    const reload = () => {
        if (id === -1) {
            reloadOperation()
        } else {
            reloadOperation(id)
        }
    }

    const submitTransaction = async (event: any) => {
        event.preventDefault();
        if (transactionObj.transactionName === "") {
            setErr(true)
            setErrMsg("Enter transaction Name")
            return
        } else if (transactionObj.transactionType !== "credit" && transactionObj.transactionType !== "debit") {
            setErr(true)
            setErrMsg("Enter transaction Type")
            return
        } else if (transactionObj.transactionCategory === "") {
            setErr(true)
            setErrMsg("Enter transaction Category")
            return
        } else if (transactionObj.transactionAmount === "") {
            setErr(true)
            setErrMsg("Enter transaction Amount")
            return
        } else if (transactionObj.transactionDate === "") {
            setErr(true)
            setErrMsg("Enter transaction Date")
            return
        }
        await fetchData()
        if (res_error !== 400) {
            if (res_data?.insert_transactions_one !== null) {
                store?.addNewTransaction(res_data.insert_transactions_one)
                alert("Added Successfully")
                setErr(false)
                setErrMsg("")
                transactionObj.refreshValues()
            }
        } else {
            alert('Something went wrong, please try again later')
            setErr(false)
            setErrMsg("")
        }
        reload()
    }

    return (
        <Popup trigger={<button className='add-transaction-button'>+ Add Transaction</button>} {...{ overlayStyle }} modal>
            <form className="add-modal" onSubmit={(event) => submitTransaction(event)}>
                <div className="add-modal-container">
                    <div className="add-modal-description-container">
                        <h1 className="add-modal-description-heading">Add Transaction</h1>
                        <p className="add-modal-description-para">You can add your transaction here</p>
                    </div>
                    <button className="into-btn">X</button>
                </div>
                <div className="input-container">
                    <label htmlFor="transactionName" className="transaction-label">Transaction name</label>
                    <input type="text" id="transactionName" value={transactionObj.transactionName} className="input-label" placeholder="Enter Name" onChange={(event) => transactionObj.addTransactionName(event.target.value)} />
                </div>
                <div className="input-container">
                    <label htmlFor="transactionType" className="transaction-label">Transaction Type</label>
                    <select value={transactionObj.transactionType} onChange={(event) => transactionObj.addTransactionType(event.target.value as TransactionType)} id="transactionType" className="input-label">
                        <option value="">Select type</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                </div>
                <div className="input-container">
                    <label htmlFor="transactionCategory" className="transaction-label">Category</label>
                    <select value={transactionObj.transactionCategory} onChange={(event) => transactionObj.addTransactionCategory(event.target.value)} id="transactionCategory" className="input-label">
                        <option value="">Select an Category</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Dining">Dinning</option>
                        <option value="transfer">Transfer</option>
                        <option value="work">Work</option>
                        <option value="food">Food</option>
                        <option value="service">Service</option>
                    </select>
                </div>
                <div className="input-container">
                    <label htmlFor="transactionAmount" className="transaction-label">Amount</label>
                    <input type="number" id="transactionAmount" value={transactionObj.transactionAmount} className="input-label" placeholder="Enter Your Amount" onChange={(event) => transactionObj.addTransactionAmount(event.target.value)} />
                </div>
                <div className="input-container">
                    <label htmlFor="transactionDate" className="transaction-label">Date</label>
                    <input type="date" id="transactionDate" value={transactionObj.transactionDate} className="input-label" placeholder="Select date" onChange={(event) => transactionObj.addTransactionDate(event.target.value)} />
                </div>
                <button className="add-transaction-btn" type="submit">Add Transaction</button>
                {err && (<p className="err-msg">{errMsg}</p>)}
            </form>
        </Popup>
    )

}

export default observer(AddPopup)
import Popup from "reactjs-popup";
import './index.css'
import { useState } from "react";
import { useCookies } from "react-cookie";
import useFetch from "../../hooks/useFetch";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const overlayStyle = { background: 'rgba(0,0,0,0.5)'};

interface AddPopupProps {
    reloadOperation: (id?: number) => Promise<void>,
    id: number
}

const AddPopup = (props:AddPopupProps) => {
    const { reloadOperation, id } = props
    const [cookie, _] = useCookies(["user_id"])
    const [transactionName, setTransactionName] = useState("")
    const [transactionType, setTransactionType] = useState("")
    const [transactionCategory, setTransactionCategory] = useState("")
    const [transactionAmount, setTransactionAmount] = useState("")
    const [transactionDate, setTransactionDate] = useState("")
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const { fetchData, res_error } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/add-transaction", method: "POST", headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'user',
            'x-hasura-user-id': cookie.user_id
        }, body: {
            name: transactionName,
            type: transactionType,
            category: transactionCategory,
            amount: transactionAmount,
            date: transactionDate,
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
        if (transactionName === "") {
            setErr(true)
            setErrMsg("Enter transaction Name")
            return
        } else if (transactionType === "") {
            setErr(true)
            setErrMsg("Enter transaction Type")
            return
        } else if (transactionCategory === "") {
            setErr(true)
            setErrMsg("Enter transaction Category")
            return
        } else if (transactionAmount === "") {
            setErr(true)
            setErrMsg("Enter transaction Amount")
            return
        } else if (transactionDate === "") {
            setErr(true)
            setErrMsg("Enter transaction Date")
            return
        }
        await fetchData()
        if (res_error !== null) {
            alert("Added Successfully")
            setErr(false)
            setErrMsg("")
        } else {
            alert('Something went wrong, please try again later')
            setErr(false)
            setErrMsg("")
        }
        setTransactionName("")
        setTransactionType("")
        setTransactionCategory("")
        setTransactionAmount("")
        setTransactionDate("")
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
                        <input type="text" id="transactionName" value={transactionName} className="input-label" placeholder="Enter Name" onChange={(event) => setTransactionName(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <label htmlFor="transactionType" className="transaction-label">Transaction Type</label>
                        <select value={transactionType} onChange={(event) => setTransactionType(event.target.value)} id="transactionType" className="input-label">
                            <option value="">Select type</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>
                    <div className="input-container">
                        <label htmlFor="transactionCategory" className="transaction-label">Category</label>
                        <select value={transactionCategory} onChange={(event) => setTransactionCategory(event.target.value)} id="transactionCategory" className="input-label">
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
                        <input type="number" id="transactionAmount" value={transactionAmount} className="input-label" placeholder="Enter Your Amount" onChange={(event) => setTransactionAmount(event.target.value)} />
                    </div>
                    <div className="input-container">
                        <label htmlFor="transactionDate" className="transaction-label">Date</label>
                        <input type="date" id="transactionDate" value={transactionDate} className="input-label" placeholder="Select date" onChange={(event) => setTransactionDate(event.target.value)} />
                    </div>
                    <button className="add-transaction-btn" type="submit">Add Transaction</button>
                    {err && (<p className="err-msg">{errMsg}</p>)}
                </form>
        </Popup>
    )

}

export default AddPopup
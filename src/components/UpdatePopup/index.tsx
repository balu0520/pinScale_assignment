import { useState, useContext, useMemo } from 'react'
import './index.css'
import Popup from 'reactjs-popup'
import { VscEdit } from 'react-icons/vsc'
import { useCookies } from 'react-cookie'
import useFetch from '../../hooks/useFetch'
import { TransactionItem, UpdatePopupProps } from '../../types/interfaces'
import { TransactionContext } from '../../context/transactionContext'
import { observer } from 'mobx-react-lite'
import TransactionObject from '../../models/TransactionObject'
const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

const UpdatePopup = observer((props: UpdatePopupProps) => {
    const [cookie, _] = useCookies(["user_id"])
    const { transaction, reloadOperation, id } = props
    const store = useContext(TransactionContext)
    const dateString = transaction.date;
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    const formattedDate = `${year}-${month}-${day}`
    const transactionObj = useMemo(() => {
        return new TransactionObject(transaction.transaction_name, transaction.type, transaction.category, transaction.amount, formattedDate)
    }, [])
    // transactionObj.transactionName = transaction.transaction_name
    // transactionObj.transactionType = transaction.type
    // transactionObj.transactionAmount = transaction.amount
    // transactionObj.transactionCategory = transaction.category
    // transactionObj.transactionDate = formattedDate
    // const [transactionName, setTransactionName] = useState(transaction.transaction_name)
    // const [transactionType, setTransactionType] = useState(transaction.type)
    // const [transactionCategory, setTransactionCategory] = useState(transaction.category)
    // const [transactionAmount, setTransactionAmount] = useState(transaction.amount)
    // const [transactionDate, setTransactionDate] = useState(formattedDate)
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const { fetchData, res_error, res_data } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/update-transaction", method: "POST", headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'user',
            'x-hasura-user-id': cookie.user_id
        }, body: {
            id: transaction.id,
            name: transactionObj.transactionName,
            type: transactionObj.transactionType,
            category: transactionObj.transactionCategory,
            amount: transactionObj.transactionAmount,
            date: transactionObj.transactionDate,
        }
    })

    const reload = () => {
        if (id === -1) {
            reloadOperation()
        } else {
            reloadOperation(id)
        }
    }


    const updateTransaction = async (event: any) => {
        event.preventDefault();
        if (transactionObj.transactionName === "") {
            setErr(true)
            setErrMsg("Enter transaction Name")
            return
        } else if (transactionObj.transactionAmount.toString() === "") {
            setErr(true)
            setErrMsg("Enter transaction Amount")
            return
        }
        await fetchData()
        if (res_error !== 400) {
            if (res_data?.update_transactions_by_pk !== null) {
                const updatedItem: TransactionItem = res_data.update_transactions_by_pk
                store.updateTransaction(updatedItem)
                alert("updated Successfully")
                setErr(false)
            }

        } else {
            alert('Something went wrong, please try again later')
            setErr(false)
        }
        setErrMsg("")
        reload()
    }

    return (
        <Popup trigger={<button className='btn' style={{ color: "#2D60FF" }}><VscEdit /></button>} {...{ overlayStyle }} modal>
            <form className="update-add-modal" onSubmit={(event) => updateTransaction(event)}>
                <div className="update-add-modal-container">
                    <div className="update-add-modal-description-container">
                        <h1 className="update-add-modal-description-heading">Update Transaction</h1>
                        <p className="update-add-modal-description-para">You can update your transaction</p>
                    </div>
                    <button className="into-btn" >X</button>
                </div>
                <div className="update-input-container">
                    <label htmlFor="transactionName" className="update-transaction-label">Transaction name</label>
                    <input type="text" id="transactionName" value={transactionObj.transactionName} className="update-input-label" placeholder="Enter Name" onChange={(event) => transactionObj.addTransactionName(event.target.value)} />
                </div>
                <div className="update-input-container">
                    <label htmlFor="transactionType" className="update-transaction-label">Transaction Type</label>
                    <select value={transactionObj.transactionType} onChange={(event) => transactionObj.addTransactionType(event.target.value)} id="transactionType" className="update-input-label">
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                </div>
                <div className="update-input-container">
                    <label htmlFor="transactionCategory" className="update-transaction-label">Category</label>
                    <select value={transactionObj.transactionCategory} onChange={(event) => transactionObj.addTransactionCategory(event.target.value)} id="transactionCategory" className="update-input-label">
                        <option value={transactionObj.transactionCategory}>{transactionObj.transactionCategory}</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Dining">Dinning</option>
                        <option value="transfer">Transfer</option>
                        <option value="work">Work</option>
                        <option value="food">Food</option>
                        <option value="service">Service</option>
                    </select>
                </div>
                <div className="update-input-container">
                    <label htmlFor="transactionAmount" className="update-transaction-label">Amount</label>
                    <input type="number" id="transactionAmount" value={transactionObj.transactionAmount} className="update-input-label" placeholder="Enter Your Amount" onChange={(event) => transactionObj.addTransactionAmount(parseInt(event.target.value))} />
                </div>
                <div className="update-input-container">
                    <label htmlFor="transactionDate" className="update-transaction-label">Date</label>
                    <input type="date" id="transactionDate" value={transactionObj.transactionDate} className="update-input-label" placeholder="Select date" onChange={(event) => transactionObj.addTransactionDate(event.target.value)} />
                </div>
                <button className="update-add-transaction-btn" type="submit">Update Transaction</button>
                {err && (<p className="err-msg">{errMsg}</p>)}
            </form>
        </Popup>
    )

})

export default UpdatePopup
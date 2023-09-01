import Popup from 'reactjs-popup'
import { FiAlertTriangle } from 'react-icons/fi'
import { FaRegTrashAlt } from 'react-icons/fa'
import {useContext} from 'react'
import './index.css'
import { useCookies } from 'react-cookie'
import useFetch from '../../hooks/useFetch'
import { DeletePopupProps } from '../../types/interfaces'
import { observer } from 'mobx-react-lite'
import { TransactionContext } from '../../context/transactionContext'
const overlayStyle = { background: 'rgba(0,0,0,0.5)' };


const DeletePopup = observer((props:DeletePopupProps) => {
    const [cookie, _] = useCookies(["user_id"])
    const { transaction, reloadOperation, id } = props
    const store = useContext(TransactionContext)
    const { fetchData, res_error } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/delete-transaction", method: "DELETE", headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
            'x-hasura-role': 'user',
            'x-hasura-user-id': cookie.user_id
        }, params: {
            "id": transaction.id
        }
    })

    const reload = () => {
        if (id === -1) {
            reloadOperation()
        } else {
            reloadOperation(id)
        }
    }

    const deleteTransaction = async (id:number) => {
        await fetchData()
        // console.log(res_error)
        if (res_error !== 400) {
            store.deleteNewTransaction(id)
            alert("Successful")
        } else {
            alert('Something went wrong, please try again later')
        }
        reload()
    }

    return (
        <Popup trigger={<button className='btn' style={{ color: "#FE5C73" }}><FaRegTrashAlt /></button>} {...{ overlayStyle }} modal>
                <div className='delete-modal' >
                    <div className='delete-modal-container'>
                        <div className='alert-container'>
                            <div className='alert-sub-container'>
                                <FiAlertTriangle className='alert-icon' />
                            </div>
                        </div>
                        <div className='delete-container'>
                            <h1 className='delete-heading'>Are you sure you want to Delete?</h1>
                            <p className='delete-para'>This transaction will be deleted immediately. You can’t undo this action.</p>
                            <div className='delete-btn-container'>
                                <button className='delete-btn' onClick={() => deleteTransaction(transaction.id)}>Yes, Delete</button>
                                <button className='no-delete-btn'>No, Leave it</button>
                            </div>
                        </div>
                        <button className='into-btn'>X</button>
                    </div>
                </div>
        </Popup>
    )
})

export default DeletePopup
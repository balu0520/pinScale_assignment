import Popup from 'reactjs-popup'
import { FiAlertTriangle } from 'react-icons/fi'
import { FaRegTrashAlt } from 'react-icons/fa'
import axios from 'axios'
import './index.css'
import { useCookies } from 'react-cookie'

const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

const DeletePopup = props => {
    const [cookie,_] = useCookies(["user_id"])
    const { transaction,reloadOperation,id} = props

    const reload = () => {
        if(id === -1){
            reloadOperation()
        } else {
            reloadOperation(id)
        }
    }

    const deleteTransaction = (id,close) => {
        const url = "https://bursting-gelding-24.hasura.app/api/rest/delete-transaction"
        const params = {
            "id": id
        }
        axios.delete(url, {
            params: params,
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'user',
                'x-hasura-user-id': cookie.user_id
            },
        }).then(response => {
            if (response.status === 200) {
                // console.log(response)
            } else {
                alert('Something went wrong, please try again later')
            }
            close()
            reload()
        }).catch(error => {
            // console.error('Error:', error);
        });
    }

return (
    <Popup trigger={<button className='btn' style={{ color: "#FE5C73" }}><FaRegTrashAlt /></button>} position="center" {...{ overlayStyle }} modal>
        {close => (
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
                            <button className='delete-btn' onClick={() => deleteTransaction(transaction.id,close)}>Yes, Delete</button>
                            <button onClick={() => close()} className='no-delete-btn'>No, Leave it</button>
                        </div>
                    </div>
                    <button className='into-btn' onClick={() => close()}>X</button>
                </div>
            </div>
        )}
    </Popup>
)
}

export default DeletePopup
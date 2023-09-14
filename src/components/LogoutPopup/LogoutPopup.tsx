import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import './index.css'
import {MdLogout} from 'react-icons/md'
const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

const LogoutPopup = () => {
    const [_,setCookie] = useCookies(["user_id"])
    const navigate = useNavigate()

    const onClickLogout = () => {
        setCookie("user_id","")
        navigate("/login")
    }



    return(
        <Popup trigger={<button className='btn logout-profile-1'><MdLogout style={{color:"rgba(113, 142, 191, 1)",width:"20px",height:"20px"}}/></button>} {...{ overlayStyle }} modal>
            <div className='logout-modal' >
                <div className='logout-modal-container'>
                    <div className='logout-alert-container'>
                        <div className='logout-alert-sub-container'>
                            <MdLogout className='logout-alert-icon' />
                        </div>
                    </div>
                    <div className='logout-container'>
                        <h1 className='logout-heading'>Are you sure you want to Logout?</h1>
                        {/* <p className='logout-para'>.</p> */}
                        <div className='logout-btn-container'>
                            <button className='logout-btn' onClick={onClickLogout}>Yes</button>
                            <button className='no-logout-btn'>No, Leave it</button>
                        </div>
                    </div>
                    <button className='into-btn'>X</button>
                </div>
            </div>
    </Popup>
    )
}

export default LogoutPopup
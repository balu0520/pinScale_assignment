import { useEffect, useState } from 'react'
import SideBar from '../Sidebar'
import './index.css'
import { BallTriangle } from 'react-loader-spinner'
import { useCookies } from 'react-cookie'
import AddPopup from '../AddPopup'
import { useNavigate } from 'react-router-dom'

const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}

const UserProfile = () => {
    const [profile, SetProfile] = useState([])
    const [cookie, _] = useCookies(["user_id"])
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [load, setLoad] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!cookie.user_id) {
            navigate("/login")
        } else {
            setLoad(true)
        }
    }, [cookie.user_id])

    useEffect(() => {
        fetchProfileData();
    }, [])

    const fetchProfileData = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const url = "https://bursting-gelding-24.hasura.app/api/rest/profile";
        const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
                'x-hasura-role': 'user',
                'x-hasura-user-id': cookie.user_id
            },
        }
        try {
            const response = await fetch(url, options)
            if (response.ok === true) {
                const data = await response.json();
                SetProfile(data.users[0])
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const renderProfileLoadingView = () => (
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

    const renderProfileFailureView = () => (
        <div>
            <h1>Something Went Wrong</h1>
        </div>
    )

    const renderProfileSuccessView = () => (
        <div className='profile-data-container'>
            <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690866635/profile-pic_ele9mx.png' className='profile-pic' alt='profile pic' />
            <div className='profile-input-data-container'>
                <div className='profile-inputs-container'>
                    <div className='profile-input-container'>
                        <label htmlFor='name' className='profile-input-label'>Your Name</label>
                        <input type='text' id="name" defaultValue={profile.name} className='profile-input' />
                    </div>
                    <div className='profile-input-container'>
                        <label htmlFor='username' className='profile-input-label'>User Name</label>
                        <input type='text' id="username" defaultValue={profile.name} className='profile-input' />
                    </div>
                </div>
                <div className='profile-inputs-container'>
                    <div className='profile-input-container'>
                        <label htmlFor='email' className='profile-input-label'>Email</label>
                        <input type='text' id="email" defaultValue={profile.email} className='profile-input' />
                    </div>
                    <div className='profile-input-container'>
                        <label htmlFor='password' className='profile-input-label'>Password</label>
                        <input type='password' id="password" defaultValue="12345" className='profile-input' />
                    </div>
                </div>
                <div className='profile-inputs-container'>
                    <div className='profile-input-container'>
                        <label htmlFor='dob' className='profile-input-label'>Date of Birth</label>
                        <input type='date' id="dob" defaultValue={profile.date_of_birth} className='profile-input' />
                    </div>
                    <div className='profile-input-container'>
                        <label htmlFor='presentAddress' className='profile-input-label'>Present Address</label>
                        <input type='text' id="presentAddress" defaultValue={profile.present_address} className='profile-input' />
                    </div>
                </div>
                <div className='profile-inputs-container'>
                    <div className='profile-input-container'>
                        <label htmlFor='permanentAddress' className='profile-input-label'>Permanent Address</label>
                        <input type='text' id="permanentAddress" defaultValue={profile.permanent_address} className='profile-input' />
                    </div>
                    <div className='profile-input-container'>
                        <label htmlFor='city' className='profile-input-label'>City</label>
                        <input type='text' id="city" defaultValue={profile.city} className='profile-input' />
                    </div>
                </div>
                <div className='profile-inputs-container'>
                    <div className='profile-input-container'>
                        <label htmlFor='postalCode' className='profile-input-label'>Postal Code</label>
                        <input type='number' id="postalCode" defaultValue={profile.postal_code} className='profile-input' />
                    </div>
                    <div className='profile-input-container'>
                        <label htmlFor='country' className='profile-input-label'>Country</label>
                        <input type='text' id="country" defaultValue={profile.country} className='profile-input' />
                    </div>
                </div>
            </div>
        </div>
    )


    const renderProfile = () => {
        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderProfileSuccessView()
            case apiStatusConstants.failure:
                return renderProfileFailureView()
            case apiStatusConstants.inProgress:
                return renderProfileLoadingView()
            default:
                return null
        }
    }

    return (
        <>
            {load && (
                <div className='container-profile'>
                    <SideBar activeId={2} />
                    <div style={{ width: "100%" }}>
                        <div className='profile-container'>
                            <h1 className='profile-heading'>Profile</h1>
                            <AddPopup reloadOperation={fetchProfileData} id={-1} />
                        </div>
                        <div className='profile-sub-container'>
                            {renderProfile()}
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

export default UserProfile
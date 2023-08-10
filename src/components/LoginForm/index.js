import { useState,useEffect } from 'react'
import './index.css'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [cookie, setCookie] = useCookies(["user_id"])
    const [load, setLoad] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!cookie.user_id) {
            setLoad(true)
        } else if (cookie.user_id == 3) {
            navigate("/admin-dashboard")
        } else {
            navigate("/user-dashboard")
        }
    }, [cookie.user_id])

    const onSubmitSuccess = get_user_id => {
        setErr(false)
        setErrMsg("")
        setCookie("user_id", get_user_id[0].id);
        if (get_user_id[0].id !== 3) {
            navigate("/user-dashboard")
        } else {
            navigate("/admin-dashboard")
        }

    }

    const onSubmitFailure = msg => {
        setErr(true)
        setErrMsg("Invalid Credentials")
    }

    const handleLogin = async event => {
        event.preventDefault()
        const url = "https://bursting-gelding-24.hasura.app/api/rest/get-user-id"
        const userDetails = { email, password }
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
            },
            body: JSON.stringify(userDetails)
        }
        try {
            const response = await fetch(url, options)
            // console.log(response)
            if (response.ok === true) {
                const data = await response.json();
                onSubmitSuccess(data.get_user_id)
            } else {
                onSubmitFailure(response.data)
            }
        } catch (error) {
            // console.error(error)
        }

    }

    return (
        <>
            {load && (
                <div className="container">
                    <div className="desktopViewBoard">
                        <h1 className="desktopViewBoardHeading">Login</h1>
                    </div>
                    <div className="loginContainerMain">
                        <div className="signInContainer">
                            <h1 className="signInHeading">Sign In</h1>
                            <p className="signInPara">Sign in to your account</p>
                            <form className="loginFormContainer" onSubmit={handleLogin}>
                                <div style={{ margin: 'auto', width: '85%' }}>
                                    <div className="inputFormContainer">
                                        <label className="loginFormName" htmlFor='email'>email</label>
                                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id='email' className="loginFormInput" />
                                    </div>
                                    <div className="inputFormContainer">
                                        <label className="loginFormName" htmlFor='password'>Password</label>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" className="loginFormInput" />
                                        {err && (<p className="errorMsg">{errMsg}</p>)}
                                    </div>
                                    <button type="submit" className="sign-in-btn">Sign In</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default LoginForm
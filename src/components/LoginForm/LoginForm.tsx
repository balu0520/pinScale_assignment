import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'

const LoginForm = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [cookie, setCookie] = useCookies(["user_id"])
    const [load, setLoad] = useState(false)
    const { fetchData, resData, res } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/get-user-id", method: 'POST', headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
        },
        params: {},
        body: { email, password }
    })
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

    useEffect(() => {
        getLogin()
    }, [resData])

    const onSubmitSuccess = (get_user_id: any): void => {
        setErr(false)
        setErrMsg("")
        setCookie("user_id", get_user_id[0].id);
        if (get_user_id[0].id !== 3) {
            navigate("/user-dashboard")
        } else {
            navigate("/admin-dashboard")
        }

    }

    const getLogin = () => {
        if (res?.ok === true) {
            if (resData !== null && resData.get_user_id.length !== 0) {
                onSubmitSuccess(resData.get_user_id)
            } else {
                onSubmitFailure()
            }
        }
    }

    const onSubmitFailure = () => {
        setErr(true)
        setErrMsg("*Invalid Credentials")
    }

    const handleLogin = async (event: any) => {
        event.preventDefault()
        await fetchData()
    }

    return (
        <>
            {load && (
                <div className="h-screen flex flex-col justify-center items-center md:w-full sm:w-full w-full">
                    <div className="shadow rounded-lg flex flex-col">
                        {/* <h1 className="text-3xl font-bold pl-2">Sign In</h1>
                        <p className="text-xl font-medium pl-2">Sign in to your account</p> */}
                        <div className='flex flex-row items-center p-4 text-center self-center'>
                            <img src="https://res.cloudinary.com/daz94wyq4/image/upload/v1690731094/dollar_icon_o1ss4i.png" className='dollar-icon' alt='dollar icon' />
                            <h1 className='text-money-clr'>Money </h1>
                            <h1 className='text-matter-clr'>Matters</h1>
                        </div>
                        <form className="sm:w-[385px] h-[317px] flex flex-col rounded-t-3xl mt-6 w-[300px] bg-teal-300" onSubmit={(e) => handleLogin(e)}>
                            <div className='m-auto w-5/6'>
                                <div className="w-full flex flex-col">
                                    <label className="text-xl font-semibold" htmlFor='email'>Email</label>
                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id='email' className="w-full h-10 rounded-md outline-0 mb-4 text-black border-black pl-2 text-lg hover:border-cyan-500" />
                                </div>
                                <div className="w-full flex flex-col">
                                    <label className="text-xl font-semibold" htmlFor='password'>Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" className="w-full h-10 rounded-md outline-0 mb-4 text-black border-black pl-2 text-lg hover:border-cyan-500" />
                                    {err && (<p className="pt-0 text-red-600 text-sm">{errMsg}</p>)}
                                </div>
                                <button type="submit" className="w-full bg-white border-cyan-500 h-10 text-cyan-900 text-lg outline-0 rounded-lg hover:border-0 hover:text-white bg-base-white hover:bg-cyan-600 cursor-pointer shadow-none">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default LoginForm
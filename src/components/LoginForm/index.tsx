import { useState, useEffect } from 'react'
import './index.css'
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
    const { fetchData, res_data, res } = useFetch({
        url: "https://bursting-gelding-24.hasura.app/api/rest/get-user-id", method: 'POST', headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
        },
        params:{},
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
    }, [res_data])

    const onSubmitSuccess = (get_user_id:any): void => {
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
            if (res_data !== null && res_data.get_user_id.length !== 0) {
                onSubmitSuccess(res_data.get_user_id)
            } else {
                onSubmitFailure()
            }
        }
    }

    const onSubmitFailure = () => {
        setErr(true)
        setErrMsg("Invalid Credentials")
    }

    const handleLogin = async (event:any) => {
        event.preventDefault()
        await fetchData()
    }

    return (
        <>
            {load && (
                <div className="flex w-screen">
                    <div className="h-screen lg:w-2/5 bg-cyan-500 md:hidden lg:flex flex-col justify-center items-center sm:hidden hidden">
                        <h1 className="text-white md:hidden lg:block text-5xl">Money Matters</h1>
                    </div>
                    <div className="h-screen flex flex-col justify-center items-center lg:w-3/5 md:w-full bg-teal-300 sm:w-full w-full">
                        <div className="shadow rounded-lg bg-teal-100">
                            <h1 className="text-3xl font-bold pl-2">Sign In</h1>
                            <p className="text-xl font-medium pl-2">Sign in to your account</p>
                            <form className="sm:w-[385px] h-[317px] flex flex-col bg-white rounded-3xl mt-6 w-[300px]" onSubmit={(e) => handleLogin(e)}>
                                <div className='m-auto w-5/6'>
                                    <div className="w-full flex flex-col">
                                        <label className="text-xl font-semibold" htmlFor='email'>Email</label>
                                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id='email' className="w-full h-10 rounded-md outline-0 mb-4 text-black border-black pl-2 text-lg" />
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <label className="text-xl font-semibold" htmlFor='password'>Password</label>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" className="w-full h-10 rounded-md outline-0 mb-4 text-black border-black pl-2" />
                                        {err && (<p className="pt-0 text-red-600 text-sm">{errMsg}</p>)}
                                    </div>
                                    <button type="submit" className="w-full bg-white border-x-cyan-500 border-y-cyan-500 h-10 text-cyan-900 text-lg outline-0 rounded-lg hover:border-0 hover:text-white hover:bg-cyan-600 cursor-pointer">Login</button>
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
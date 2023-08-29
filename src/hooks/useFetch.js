import { useState } from "react"
const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}
export function useFetch({url,method,headers,params}){
    const [apiStatus,setApiStatus] = useState(apiStatusConstants.initial)
    const options = {method,headers}
    let modifiedUrl = url
    if(params !== undefined){
        const limit = params.limit
        const offset = params.offset
        modifiedUrl = `${url}?limit=${limit}&offset=${offset}`
    } 
    const fetchHook = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const response = await fetch(modifiedUrl,options)
        if(response.ok === true){
            setApiStatus(apiStatusConstants.success)
        } else {
            setApiStatus(apiStatusConstants.failure)
        }
        return response
    }
    return {fetchHook,apiStatus}
} 
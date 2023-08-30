import { useEffect, useState } from "react"
const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}
function useFetch({ url, method, headers, params, body }) {
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [res, setRes] = useState(null)
    const [resData, setResData] = useState(null)
    const [resError, setResError] = useState(null)
    let options = { method, headers }
    if (body !== undefined) {
        options = { method, headers, body: JSON.stringify(body) }
    }
    let modifiedUrl = url
    if (params !== undefined) {
        if (params.id === undefined) {
            const limit = params.limit
            const offset = params.offset
            modifiedUrl = `${url}?limit=${limit}&offset=${offset}`
        } else {
            const id = params.id
            modifiedUrl = `${url}?id=${id}`
        }
    }
    const fetchData = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try{
            const response = await fetch(modifiedUrl, options)
        setRes(response)
        if (response.ok === true) {
            const data = await response.json()
            setResData(data)
            setResError(null)
            setApiStatus(apiStatusConstants.success)
        } else {
            const err = response.status
            setResError(err)
            setResData(null)
            setApiStatus(apiStatusConstants.failure)
        }
        }catch(err){
            setResError(err)
            setApiStatus(apiStatusConstants.failure)
        }
    }

    return { fetchData, apiStatus, res, res_data: resData, res_error: resError }
}

export default useFetch
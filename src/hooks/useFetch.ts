import { useState } from "react"
import { FetchResult,FetchProps,Params,Body } from "../types/interfaces";

type apiStatusConstants = "INITIAL" | "SUCCESS" | "FAILURE" | "IN_PROGRESS"

function useFetch(props: FetchProps):FetchResult {
    const { url, method, headers, body, params } = props
    const [apiStatus, setApiStatus] = useState<apiStatusConstants>("INITIAL")
    const [res, setRes] = useState<Response | any>(null)
    const [resData, setResData] = useState<any>(null)
    const [resError, setResError] = useState<any>(null)
    let options: RequestInit = {method,headers};
    if (body !== undefined) {
        options = {method,headers, body: JSON.stringify(body) };
      }
    let modifiedUrl = url
    if (params !== undefined && Object.keys(params).length > 0) {
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
        setApiStatus("IN_PROGRESS")
        try {
            const response = await fetch(modifiedUrl, options)
            setRes(response)
            if (response.ok === true) {
                const data = await response.json()
                setResData(data)
                setResError(null)
                setApiStatus("SUCCESS")
                return data
            } else {
                const err = response.status
                setResError(err)
                setResData(null)
                setApiStatus("FAILURE")
                return null
            }
        } catch (err) {
            setResError(err)
            setApiStatus("FAILURE")
        }
    }

    return { fetchData, apiStatus, res, res_data: resData, res_error: resError }
}


export default useFetch
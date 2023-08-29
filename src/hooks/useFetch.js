import { useState } from "react"
const apiStatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    failure: "FAILURE",
    inProgress: "IN_PROGRESS"
}
export function useFetch({ url, method, headers, params, body }) {
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
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
    let response_data = null;
    let response_err = null;
    const fetchData = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const response = await fetch(modifiedUrl, options)
        // console.log(response)
        if (response.ok === true) {
            response_data = await response.json()
            setApiStatus(apiStatusConstants.success)
        } else {
            setApiStatus(apiStatusConstants.failure)
            response_err = response.status
        }
        return { response, response_data, response_err }
    }

    return { fetchData, apiStatus }
} 
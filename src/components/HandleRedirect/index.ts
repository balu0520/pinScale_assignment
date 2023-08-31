import { useEffect } from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

const HandleRedirect = () => {
    const navigate = useNavigate()
    const [cookie,_] = useCookies(["user_id"])
    
    useEffect(() => {
        if(!cookie.user_id){
            navigate("/login")
          } else if(cookie.user_id === 3){
            navigate("/admin-dashboard")
          } else {
            navigate("/user-dashboard")
          }
    },[cookie.user_id])

    return null
  }

export default HandleRedirect
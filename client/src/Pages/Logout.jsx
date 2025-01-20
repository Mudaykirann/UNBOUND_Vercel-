import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from 'react-router-dom'


function Logout() {

    const { setcurrentuser } = useContext(UserContext)


    const navigate = useNavigate()


    setcurrentuser(null)
    navigate('/login')
    return (
        <>

        </>
    )
}

export default Logout

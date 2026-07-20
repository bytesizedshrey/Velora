import {setError,setLoading,setUser} from "../state/auth.slice"
import { register } from "../service/auth.api"


export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({email,contact,password,fullname, isBuyer, isSeller = false}) {
        const data = await register({email,contact,password,fullname})
    }

    dispatch(setUser(data.user))

    return {handleRegister}
}
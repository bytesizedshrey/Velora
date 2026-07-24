import { setError, setLoading, setUser } from "../state/auth.slice"
import { register, login, getMe } from "../service/auth.api"
import { useDispatch } from "react-redux"

export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullname, isBuyer, isSeller = false }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, contact, password, fullname, isSeller })
            dispatch(setUser(data.user))
            dispatch(setLoading(false))
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message))
            dispatch(setLoading(false))
        }
        return data.user
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            dispatch(setLoading(false))
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message))
            dispatch(setLoading(false))
        }
        return data.user 
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
            dispatch(setLoading(false))
            return data
        } catch (error) {
            console.error("Failed to fetch user session:", error.response?.data?.message || error.message)
            dispatch(setLoading(false))
        }
    }

    return { handleRegister, handleLogin, handleGetMe }
}
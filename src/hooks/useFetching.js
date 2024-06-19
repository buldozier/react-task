import {useState} from "react";

export const useFetching = (callback) => {
    // Кастомный хук для запросов, принимает функцию, которую нужно выполнить в случае успешного запроса

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    const fetching = async (...args) => {
        try {
            setIsLoading(true)
            await callback(...args)
        } catch (e) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }
    // Возвращает функцию, которую нужно вызвать для запроса, состояние запроса и ошибку, если таковая имеется
    return [fetching, isLoading, error]
}
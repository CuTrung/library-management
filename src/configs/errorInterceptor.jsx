// interceptor to catch errors
const errorInterceptor = (error) => {
    // check if it's a server error
    if (!error.response) {
        console.log('Some thing wrongs on server...')
        return Promise.reject(error)
    }

    // all the error responses
    switch (error.response.status) {
        case 400:
            // toast.error(error.response.status, error.message)
            console.log('📡 API | Nothing to display', 'Data Not Found')
            break

        case 401: // authentication error, logout the user
            console.log('📡 API | Please login again', 'Session Expired')
            localStorage.removeItem('user')
            break

        case 403:
            // toast.error(error.response.status, error.message)
            console.log('📡 API | Access denied', 'Data Not Found')
            break

        case 404:
            // toast.error("Some thing wrongs on client...")
            console.log('📡 API | Dataset not found', 'Data Not Found')
            break

        case 422:
            // toast.error(error.response.status, error.message, error.response.data.detail)
            console.log('📡 API | Validation error', 'Unprocessable Content')
            break

        default:
            console.log(error)
    }
    return Promise.reject(error)
}

export default errorInterceptor;
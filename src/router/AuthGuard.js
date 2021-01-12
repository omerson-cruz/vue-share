import store from '../store/index'

export default (to, from, next) => {
    console.log("Executing Auth Guard")
    // console.log("store state user: ", store.state)
    // console.log("store getter user: ", store.getters)
    // console.log(store.state.user)
    // console.log(store.getters.user)

    // console.log('AuthGuard getting from the local storage instead, ', JSON.parse(localStorage.getItem('user')) )

    // const user = JSON.parse(localStorage.getItem('user'))

    // if(!store.getters) {
    if(!store.getters.user) {
        console.log("redirecting")
        next({
            path: '/signin'
        })
    } else  {
        next()
    }
}
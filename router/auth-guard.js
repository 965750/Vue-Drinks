// if user != logged

import { store } from '../store'

export default (to, from, next) => {
    if (store.getters.G_USER) {
        next()
    } else {
        next('/signin')
    }
}
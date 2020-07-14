import axios from 'axios'
import { expireAuthentication } from './auth'

// Actions
const REQUEST  = 'teppee/campgrounds/REQUEST'
const RECEIVED = 'teppee/campgrounds/RECEIVED'
const FAILED   = 'teppee/campgrounds/FAILED'
const DELETED  = 'teppee/campgrounds/DELETED'

// Action Creators
export function fetchCampgrounds() {
    return (dispatch, getState) => {
        const { auth } = getState()
        dispatch(requestCampgrounds())
        return axios({
            url: '/api/campgrounds',
            headers: {
                'access-token': auth.accessToken,
                'client'      : auth.client,
                'uid'         : auth.uid,
                'expiry'      : auth.expiry,
                'token-type'  : 'Bearer'
            }
        }).then(response => {
            dispatch(receiveCampgrounds(response.data.campgrounds))
        }).catch(error => {
            dispatch(failFetchCampgrounds())
            if (error.response && error.response.status === 401) {
                dispatch(expireAuthentication())
            }
        })
    }
}

export function deleteCampground(id) {
    return (dispatch, getState) => {
        const { auth } = getState()
        return axios({
            url: `/api/campgrounds/${id}`,
            method: 'DELETE',
            headers: {
                'access-token': auth.accessToken,
                'client'      : auth.client,
                'uid'         : auth.uid,
                'expiry'      : auth.expiry,
                'token-type'  : 'Bearer'
            }
        }).then(response => {
            dispatch(deletedCampground(id))
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                dispatch(expireAuthentication())
            }
        })
    }
}

function requestCampgrounds() {
    return { type: REQUEST }
}

function receiveCampgrounds(campgrounds) {
    return { type: RECEIVED, campgrounds }
}

function failFetchCampgrounds() {
    return { type: FAILED }
}

function deletedCampground(id) {
    return { type: DELETED, id }
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case REQUEST:
            return Object.assign(
                {},
                state,
                {
                    loading: true
                }
            )
        case RECEIVED:
            return {
                loading:     false,
                campgrounds: action.campgrounds
            }
        case FAILED:
            return Object.assign(
                {},
                state,
                {
                    loading: false
                }
            )
        case DELETED: {
            const campgrounds = [].concat(
                state.campgrounds.filter((campground) => campground.id !== parseInt(action.id))
            )
            return { loading: false, campgrounds }
        }
        default: return state
    }
}

const initialState = {
    loading: false,
    campgrounds: []
}

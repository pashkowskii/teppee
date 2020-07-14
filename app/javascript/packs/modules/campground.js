import axios                    from 'axios'
import { expireAuthentication } from './auth'

// Actions
const REQUEST  = 'teppee/campground/REQUEST'
const RECEIVED = 'teppee/campground/RECEIVED'
const FAILED   = 'teppee/campground/FAILED'

// Action Creators
export function fetchCampground(id) {
    return (dispatch, getState) => {
        const { auth } = getState()
        dispatch(requestCampground())
        return axios({
            url: `/api/campgrounds/${id}`,
            headers: {
                'access-token': auth.accessToken,
                'client'      : auth.client,
                'uid'         : auth.uid,
                'expiry'      : auth.expiry,
                'token-type'  : 'Bearer'
            }
        }).then(response => {
            dispatch(receiveCampground(response.data.campground))
        }).catch(error => {
            dispatch(failFetchCampground())
            if (error.response && error.response.status === 401) {
                dispatch(expireAuthentication())
            }
        })
    }
}

function requestCampground() {
    return { type: REQUEST }
}

function receiveCampground(campground) {
    return { type: RECEIVED, campground }
}

function failFetchCampground() {
    return { type: FAILED }
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
                loading:    false,
                campground: action.campground
            }
        case FAILED:
            return Object.assign(
                {},
                state,
                {
                    loading:    false,
                    campground: null
                }
            )
        default: return state
    }
}

const initialState = {
    loading:    false,
    campground: null
}

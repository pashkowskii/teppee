import React               from 'react'
import { connect }         from 'react-redux'
import { Link }            from 'react-router-dom'
import { fetchCampground } from '../../modules/campground'

class Campground extends React.Component {
    componentDidMount() {
        const { id } = this.props.match.params
        this.props.dispatch(fetchCampground(id))
    }

    render() {
        const { loading, campground } = this.props
        if (loading) {
            return (
                <div>
                    <h2>Loading...</h2>
                </div>
            )
        }
        if (campground) {
            const { id } = this.props.match.params
            return (
                <div>
                    <h2>{campground.title}</h2>
                    <Link to={`/campgrounds/${id}/edit`}>Edit</Link>
                    <p>{campground.description}</p>
                    <img src={campground.image.url} alt=""/>
                </div>
            )
        }
        return (
            <div>
                <h2>Not Found</h2>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { campground } = state
    return {
        loading:    campground.loading,
        campground: campground.campground
    }
}

export default connect(mapStateToProps)(Campground)

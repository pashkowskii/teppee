import React                    from 'react'
import { Redirect }             from 'react-router-dom'
import { connect }              from 'react-redux'
import { expireAuthentication } from '../../modules/auth'
import Example                  from "../Dropzone/Dropzone";
import MapWithAMarker           from "../GoogleMap/GoogleMapComponent";

import 'react-dropzone-uploader/dist/styles.css'

class CampgroundForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            selectedImage: null,
            redirect: false,
            currentLatLng: {
                lat: 0,
                lng: 0
            },
            isMarkerShown: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    showCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.setState(prevState => ({
                        currentLatLng: {
                            ...prevState.currentLatLng,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        isMarkerShown: true
                    }))
                }
            )
        } else {
            error => console.log(error)
        }
    }

    handleSubmit(e) {
        e.preventDefault()

        const { auth }                                           = this.props
        const {title, description, selectedImage, currentLatLng} = this.state;

        if(selectedImage !== null) {
            let data                = new FormData();
            let location_attributes = JSON.stringify({'latitude' : currentLatLng.lat.toString(),
                                                      'longitude': currentLatLng.lng.toString()});

            data.append('title', title)
            data.append('description', description)
            data.append('image', selectedImage)
            data.append('location_attributes', location_attributes);

            fetch("http://localhost:3000/api/campgrounds", {
                method: 'POST',
                body: data,
                headers: {
                    'access-token': auth.accessToken,
                    'client'      : auth.client,
                    'uid'         : auth.uid,
                    'expiry'      : auth.expiry,
                    'token-type'  : 'Bearer'}
                }).then(response => {
                    this.setState({ redirect: true })
                }).catch(error => {
                if (error.response && error.response.status === 401) {
                    this.props.dispatch(expireAuthentication())
                }
            })
        }
    }

    selectImage = image => this.setState({ selectedImage: image });

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleCancel() {
        this.props.history.push("/campgrounds");
    }

    componentDidMount() {
        this.showCurrentLocation()
    }

    render() {
        const { redirect } = this.state
        if (redirect) {
            return <Redirect to="/campgrounds" />
        }

        return (
            <div className="form-group">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <input
                                className   = "title-input"
                                placeholder = "Title"
                                type        = "text"
                                value       = {this.state.title}
                                onChange    = {(e) => this.setState({ title: e.target.value })} />
                            <textarea
                                className   = "description-input"
                                placeholder = "Description"
                                value       = {this.state.description}
                                onChange    = {(e) => this.setState({ description: e.target.value })} />
                        </div>
                        <div className="form-group col-md-3">
                            <Example image         = {this.state.selectedImage}
                                     selectImage   = {this.selectImage}
                                     unselectImage = {this.unselectImage} />
                            <div>
                                <MapWithAMarker
                                    isMarkerShown   = {this.state.isMarkerShown}
                                    currentLocation = {this.state.currentLatLng} />
                            </div>
                            <input type="submit" value="Create" />
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const  { auth } = state
    return { auth }
}

export default connect(mapStateToProps)(CampgroundForm)

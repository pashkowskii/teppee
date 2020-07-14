import React                    from 'react'
import { Redirect }             from 'react-router-dom'
import { connect }              from 'react-redux'
import { expireAuthentication } from '../../modules/auth'
import { fetchCampground }      from '../../modules/campground'
import Example                  from "../Dropzone/Dropzone";

class CampgroundEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            selectedImage: null,
            redirect: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params
        this.props.dispatch(fetchCampground(id))
    }

    componentWillReceiveProps(nextProps) {
        const title         = nextProps.campground ? nextProps.campground.title         : ''
        const description   = nextProps.campground ? nextProps.campground.description   : ''
        const selectedImage = nextProps.campground ? nextProps.campground.selectedImage : null

        this.setState({ title, description, selectedImage })
    }

    handleSubmit(e) {
        e.preventDefault()

        const { auth }                            = this.props
        const {title, description, selectedImage} = this.state;

        if(selectedImage !== null && selectedImage instanceof File) {
            let data     = new FormData();
            const { id } = this.props.match.params

            data.append('title', title)
            data.append('description', description)
            data.append('image', selectedImage)

            fetch(`http://localhost:3000/api/campgrounds/${id}`, {
                method: 'PUT',
                body: data,
                headers: {
                    'access-token': auth.accessToken,
                    'client': auth.client,
                    'uid': auth.uid,
                    'expiry': auth.expiry,
                    'token-type': 'Bearer'}
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

    handleCancel() {
        this.props.history.push("/campgrounds");
    }

    render() {
        const { selectedImage } = this.state;
        const { id }            = this.props.match.params
        const { redirect }      = this.state
        const { loading }       = this.props
        if (loading) {
            return (
                <div>
                    <h2>Loading...</h2>
                </div>
            )
        }
        if (redirect) {
            return <Redirect to={`/campgrounds/${id}`} />
        }
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Example image         = {selectedImage}
                             selectImage   = {this.selectImage}
                             unselectImage = {this.unselectImage} />
                    <label>Title</label>
                    <input
                        type     = "text"
                        value    = {this.state.title}
                        onChange = {(e) => this.setState({ title: e.target.value })} />
                    <label>Content</label>
                    <textarea
                        value    = {this.state.description}
                        onChange = {(e) => this.setState({ description: e.target.value })} />
                    <input type="submit" value="Save" />
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const  { auth, campground } = state
    return { auth, loading: campground.loading, campground: campground.campground }
}

export default connect(mapStateToProps)(CampgroundEdit)

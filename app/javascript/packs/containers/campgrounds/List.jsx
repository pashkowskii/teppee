import React                                  from 'react'
import { Link }                               from 'react-router-dom'
import { connect }                            from 'react-redux'
import { List, ListItem, ListSubHeader }      from 'react-toolbox/lib/list'
import { fetchCampgrounds, deleteCampground } from '../../modules/campgrounds'
import Masonry                                from 'react-masonry-component';

const imagesLoadedOptions = { background: '.my-bg-image-el' }

const masonryOptions = {
    transitionDuration: 0
};

class CampgroundList extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchCampgrounds())
        let options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        };

        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this),
            options
        );
        this.observer.observe(this.loadingRef);
    }

    handleObserver(entities) {
        const y = entities[0].boundingClientRect.y;
        if (this.state.prevY > y && this.state.campgrounds.length) {
            const nextPage = this.state.page + 1;
            this.getCampgrounds(nextPage);
            this.setState({ page: nextPage });
        }
        this.setState({ prevY: y });
    }

    handleClick(e) {
        e.preventDefault()
        const { id, title } = e.target.dataset
        if (confirm(`Are you ok to delete "${title}"?`)) {
            this.props.dispatch(deleteCampground(id))
        }
    }

    renderCampgrounds() {
        const { campgrounds } = this.props
        const campgroundList = []
        campgrounds.forEach((campground, i) => {
            campgroundList.push(
                <div key={campground.id}>
                    <Link to={`/campgrounds/${campground.id}`}>
                        <Tile title       = {campground.title}
                              description = {campground.description}
                              src         = {campground.image.url}/>
                        {<a
                            data-id    = {campground.id}
                            data-title = {campground.title}
                            href       = "#"
                            onClick    = {this.handleClick.bind(this)}
                            className  = "btn btn-danger">Delete</a>}
                    </Link>
                </div>
            )
        })
        return (
            <Masonry
                className             = {'my-gallery-class'}
                elementType           = {'ul'}
                options               = {masonryOptions}
                disableImagesLoaded   = {false}
                updateOnEachImageLoad = {false}
                imagesLoadedOptions   = {imagesLoadedOptions}
            >
                {campgroundList}
            </Masonry>
        )
    }

    render() {
        const { loading } = this.props
        if (loading) {
            return (
                <div>
                    <h2>Campground List</h2>
                    <p>Loading...</p>
                </div>
            )
        }
        return (
            <div>
                <div className="search-bar">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Explore new places"
                               aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button">Button</button>
                            </div>
                    </div>
                </div>
                {this.renderCampgrounds()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const campgroundListState       = state.campgrounds
    const  { loading, campgrounds } = campgroundListState

    return { loading, campgrounds }
}

const Tile = ({title, description, src}) => {
    const imageHeight =  { height: 250 + Math.floor(Math.random()*10)*15 };

    return (
        <div className="tile">
            <img style={imageHeight} src={src}  alt=""/>
            <div className="details">
                <span className="title">{title}</span>
                <span className="info">{description}</span>
            </div>
        </div>
    );
};

class Masonry extends React.Component{
    constructor(props){
        super(props);
        this.state = {columns: 1};
        this.onResize = this.onResize.bind(this);
    }
    componentDidMount(){
        this.onResize();
        window.addEventListener('resize', this.onResize)
    }

    getColumns(w){
        return this.props.brakePoints.reduceRight( (p, c, i) => {
            return c < w ? p : i;
        }, this.props.brakePoints.length) + 1;
    }

    onResize(){
        const columns = this.getColumns(this.refs.Masonry.offsetWidth);
        if(columns !== this.state.columns){
            this.setState({columns: columns});
        }

    }

    mapChildren(){
        let col = [];
        const numC = this.state.columns;
        for(let i = 0; i < numC; i++){
            col.push([]);
        }
        return this.props.children.reduce((p,c,i) => {
            p[i%numC].push(c);
            return p;
        }, col);
    }

    render(){
        return (
            <div className="masonry" ref="Masonry">
                {this.mapChildren().map((col, ci) => {
                    return (
                        <div className="column" key={ci} >
                            {col.map((child, i) => {
                                return <div key={i} >{child}</div>
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }

export default connect(mapStateToProps)(CampgroundList)

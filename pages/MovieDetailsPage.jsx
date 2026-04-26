import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useState, useEffect, useContext, useRef } from "react"
const API_KEY = import.meta.env.VITE_API_KEY 
import { IoHeartOutline, IoHeart, IoStar, IoPlay } from "react-icons/io5"
import { favoritesContext } from "../context/FavoritesContext"
import CastCard from "../components/CastCard"
import TrailerWindow from "../components/TrailerWindow"
import posterPlaceholder from "../poster_placeholder.png"
import Footer from "../components/Footer"


export default function MovieDetailsPage() {

    const navigate = useNavigate()

    const {mediaType, id} = useParams()

    const [mediaDetails, setMediaDetails] = useState(null)

    const [isOpen, setIsOpen] = useState(false)

    const ageRestrictions = mediaType === "movie" ? "release_dates" : "content_ratings"

    const {favoritesList,toggleFavorites} = useContext(favoritesContext)

    const scrollRef = useRef(null)

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=details,credits,videos,${ageRestrictions}`)
            .then(res => res.json())
            .then(data => {
                if (data.success === false || (!data.title && !data.name)) {
                return navigate("/not-found", { replace: true });
            }   
                setMediaDetails(data)})
    },[id, mediaType])

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if(!scrollContainer) return

        function handleWheel(e){
            e.preventDefault()
            scrollContainer.scrollLeft += e.deltaY
        }

        scrollContainer.addEventListener("wheel", handleWheel, { passive: false})

        return () => {
            scrollContainer.removeEventListener("wheel", handleWheel)
        }
    }, [mediaDetails])

    if (!mediaDetails) return <div className="loading">Loading...</div>

    const title = mediaDetails.title || mediaDetails.name
    
    const rawYear = mediaDetails.release_date || mediaDetails.first_air_date

    const year = rawYear ? rawYear.slice(0,4) : "—"
    
    const contentRating = mediaDetails.release_dates || mediaDetails.content_ratings

    const usRating = contentRating.results.find(item => item.iso_3166_1 === 'US')

    const finalRating = mediaType === "movie" ? (usRating?.release_dates?.[0]?.certification || "NR") : (usRating?.rating || "NR");

    const runtimeInfo = mediaType === "movie" ? `${Math.floor(mediaDetails.runtime / 60)}h ${(mediaDetails.runtime % 60)}m` : mediaDetails.number_of_seasons + " " + (mediaDetails.number_of_seasons === 1 ? "season" : "seasons")
    
    const genresList = mediaDetails.genres.map(item => `[${item.name}] `)

    const castElement = mediaDetails?.credits?.cast?.slice(0, 20).map(item => {
        return <CastCard profilePic={item.profile_path} name={item.name} key={item.credit_id} id={item.id}/>
    })

    const trailer = mediaDetails.videos.results.find(item => item.type === "Trailer")

    const trailerKey = trailer ? trailer.key : null

    return (
        <div>
            <Navbar />
            
            <img className="movie-details-background" src={`https://image.tmdb.org/t/p/w1280${mediaDetails.backdrop_path}`} />
            <div className="hero-section">
                <img className="main-poster" src={mediaDetails.poster_path == null ? posterPlaceholder :`https://image.tmdb.org/t/p/w500${mediaDetails.poster_path}`}/>
                <div className="hero-info">
                    <h1 className="movie-title">{title}</h1>
                    <p className="meta-data">{year} <span>|</span> {finalRating} <span>|</span> {runtimeInfo}</p>
                    <p className="genres">{genresList}</p>
                    <p className="rating"> <IoStar size={16} color="#FFAD49" /><span>{mediaDetails.vote_average.toFixed(1)}</span></p>
                    <div className="hero-actions">
                        {trailerKey == null ? "" : <button className="btn-play" onClick={() => setIsOpen(true)}><IoPlay size={20} color="white"/><span>Play Trailer</span></button>}
                        <button className="btn-fav" onClick={() => toggleFavorites({image: mediaDetails.poster_path, title, rating: mediaDetails.vote_average, id: mediaDetails.id, year})}>{favoritesList.some(item => item.id === mediaDetails.id) ? (<IoHeart size={22} color="#EF4444" />) : (<IoHeartOutline size={22} color="white" />)}<span>{favoritesList.some(item => item.id === mediaDetails.id) ? "Remove from favorites" : "Add to favorites"}</span></button>
                    </div>
                </div>
            </div>
            <div className="details-grid">
                <div className="synopsis-container">
                    <h3>Overview</h3>
                    <p>{mediaDetails.overview}</p>
                </div>
                <div className="cast-container">
                    <h3>Cast</h3>
                    <div className="cast-scroll" ref={scrollRef}>
                        {castElement}
                    </div>
                </div>
            </div>
            {isOpen && <TrailerWindow trailerKey={trailerKey} key={`trailer-${mediaDetails.id}`} onClose={() => setIsOpen(false)} />}
            <Footer />
        </div>
    )
}
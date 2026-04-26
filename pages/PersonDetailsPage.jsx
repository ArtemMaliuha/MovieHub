import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import FilmographyCard from "../components/FilmographyCard"
import Footer from "../components/Footer"

const API_KEY = import.meta.env.VITE_API_KEY 

export default function PersonDetailsPage() {

    const roles = {
        "Acting": "Actor",
        "Directing": "Director",
        "Writing": "Writer",
        "Production": "Producer",
        "Editing": "Editor",
        "Camera": "Cinematographer",
        "Art": "Art Director",
        "Costume & Make-Up": "Costume Designer",
        "Visual Effects": "VFX Artist"
    }

    const {id} = useParams()

    const [personDetails, setPersonDetails] = useState(null)

    const [isExtended, setIsExtended] = useState(false)

    const [bestMovie, setBestMovie] = useState(null)

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&append_to_response=details,combined_credits,tagged_images`)
            .then(res => res.json())
            .then(data => {
                setPersonDetails(data)
                const moviesWithBackdrops = data.combined_credits.cast.filter(movie => movie.backdrop_path).sort((a,b) => b.vote_count - a.vote_count).slice(0,5)
                setBestMovie(moviesWithBackdrops[Math.floor(Math.random() * moviesWithBackdrops.length)])})
    }, [])

    if(!personDetails) return <div>Loading...</div>

    const rawDate = personDetails.birthday

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(rawDate))

    const isTextTooLong = personDetails.biography.length > 440 ? true : false

    const filmographyCardsElement = personDetails.combined_credits.cast.map(movie => {
                const rawYear = movie.release_date || movie.first_air_date

                const year = rawYear ? rawYear.slice(0,4) : "—"
                return <FilmographyCard image={movie.poster_path} title={movie.title || movie.original_name} key={`filmography-${movie.credit_id}`} id={movie.id} rating={movie.vote_average} year={year} mediaType={movie.media_type}/>
            })

    return (
        <div>
            <Navbar />
            <img className="actor-details-background" src={`https://image.tmdb.org/t/p/w1280${bestMovie.backdrop_path}`} />
            <div className="hero-section">
                <img className="main-profile" src={`https://image.tmdb.org/t/p/w500${personDetails.profile_path}`} />
                <div className="hero-info">
                    <h1 className="actor-name">{personDetails.name}</h1>
                    <p className="meta-data">{formattedDate} <span>|</span> {personDetails.place_of_birth} <span>|</span> {roles[personDetails.known_for_department] || "Actor"}</p>
                    <p className="genres">{`Known for ${bestMovie.character} in ${bestMovie.original_name || bestMovie.original_title}`}</p>
                    <div className="hero-actions">
                        <a href={`https://www.imdb.com/name/${personDetails.imdb_id}/`} target="_blank" className="imdb-link">IMDB Profile</a>
                    </div>
                </div>
            </div>
            <div className="bio-credits-section">
                <div className="biography-container">
                    <h3 className="biography-header">Biography</h3>
                    <p className="biography-paragraph">{isExtended ? personDetails.biography : personDetails.biography.slice(0, 440) + "..."}</p>
                    <button className={isTextTooLong ? "extend-bio-btn" : "hidden"} onClick={() => setIsExtended(prevIsExtnded => !prevIsExtnded)}>{isExtended ? "Show less" : "Show more"}</button>
                </div>
                <div className="filmography-container">
                    <h3 className="filmography-header">Filmography</h3>
                    <div className="filmography-cards">
                        {filmographyCardsElement}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
import Navbar from "../components/Navbar"
import { repeatedPosters } from "../components/services/posters.js"
import getValidPoster from "../components/services/imageService"
import useMovieSearch from "../components/hooks/useMovieSearch.jsx"
import { IoSearch } from "react-icons/io5"
import { useState, useEffect, useRef } from "react"
const API_KEY = import.meta.env.VITE_API_KEY 
import TrendingMovieCard from "../components/TrendingMovieCard.jsx"
import { useContext } from "react"
import { favoritesContext } from "../context/FavoritesContext.jsx"
import Footer from "../components/Footer.jsx"


export default function HomePage() {

    const inputRef = useRef(null)

    const scrollRef = useRef(null)

    const data = useContext(favoritesContext)

    const [trendingNow, setTrendingNow] = useState(null)

    const search = useMovieSearch()

    function handleSearch(formData) {
        const newFilm = formData.get("film-search")
        search(newFilm)
    }

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${API_KEY}`)
            .then(res => res.json())
            .then(data => setTrendingNow(data))
    }, [])

    useEffect(() => {
        inputRef.current.focus()
    }, [])

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
    }, [trendingNow]) 

    const trendingNowElement = trendingNow && trendingNow.results.map(movie => {

        const rawYear = movie.release_date || movie.first_air_date

        const year = rawYear ? rawYear.slice(0,4) : ""

        return <TrendingMovieCard image={movie.poster_path} title={movie.title ? movie.title : movie.name} key={movie.id} id={movie.id} rating={movie.vote_average} year={year} mediaType={movie.media_type}/>
    })

    return(
        <div className="homepage">
            <Navbar />
            <div className="poster-wall">
                {repeatedPosters.map((movie, index) => (
                    <img key={`${movie.id}-${index}`} alt="" src={`https://image.tmdb.org/t/p/w500${movie.image}`} onError={async (e) => {
                                                                                                                    e.target.onerror = null; 
                                                                                                                    const newPath = await getValidPoster(movie.title); 
                                                                                                                    e.target.src = `https://image.tmdb.org/t/p/w500${newPath}`;
                                                                                                                }} />
                ))}
            </div>
            <div className="homepage-search-section">
                <h1>Find your next favorite movie</h1>
                <form action={handleSearch} className="homepage-search" >
                <input ref={inputRef} type="text" name="film-search" className="homepage-search-input"/>
                <button className="homepage-search-btn"><IoSearch size={22} title="Search" />Search</button>
            </form>
            </div>
            <div className="trending-now">
                <h2>Trending now</h2>
                <div className="trending-movies-cards" ref={scrollRef}>
                    {trendingNowElement}
                </div>
            </div>
            <Footer />
        </div>
    )
}
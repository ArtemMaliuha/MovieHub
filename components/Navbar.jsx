import { Link, NavLink } from "react-router-dom"
import { IoSearch } from "react-icons/io5"
import { useContext } from "react"
import { favoritesContext } from "../context/FavoritesContext"
import useMovieSearch from "./hooks/useMovieSearch"

export default function Navbar() {

    const {favoritesList} = useContext(favoritesContext)

    const favoritesCount = favoritesList.length

    const search = useMovieSearch()
    
    function handleSearch(formData) {
        const newFilm = formData.get("film-search")
        search(newFilm)
    }

    return(
        <div className="Navbar">
            <Link to="/"><span className="movie-text">Movie</span><span className="hub-text">Hub</span></Link>
            <NavLink to="/" className="home-link" end>Home</NavLink>
            <NavLink to="/favorites" className="favorites-link">Favorites<span className={favoritesCount > 0 ? "favorites-amount" : "hidden"}>{favoritesCount}</span></NavLink>
            <form action={handleSearch} className="navbar-search">
                <button><IoSearch size={22} color="white" title="Search" /></button>
                <input type="text" placeholder="Search" name="film-search"/>
            </form>
        </div>
    )
}
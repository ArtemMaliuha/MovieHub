import Navbar from "../components/Navbar"
import { useContext } from "react"
import { favoritesContext } from "../context/FavoritesContext"
import FavoriteMovieCard from "../components/FavoriteMovieCard"
import Footer from "../components/Footer"

export default function FavoritesPage() {

    const { favoritesList, toggleFavorites} = useContext(favoritesContext)

    const favoriteElement = favoritesList && favoritesList.map(movie => {
            return <FavoriteMovieCard image={movie.image} title={movie.title} key={`favorites-${movie.id}`} id={movie.id} rating={movie.rating} year={movie.year} mediaType={movie.mediaType}/>
        })

    return (
        <div>
            <Navbar />
            <div className="favorites-background"></div>
            <h1 className="favorites-header">My watchlist</h1>
            <p className="favorites-paragraph">{favoritesList.length} items saved</p>
            <div className="favorite-movies-cards">
                {favoriteElement}
            </div>
            <Footer />
        </div>
    )
}
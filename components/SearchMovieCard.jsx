import { IoHeartOutline, IoHeart, IoStar } from "react-icons/io5";
import { useContext } from "react";
import { favoritesContext } from "../context/FavoritesContext";
import posterPlaceholder from "../poster_placeholder.png"
import { Link } from "react-router-dom";

export default function SearchMovieCard({image, title, id, year, rating, mediaType}) {

    const {favoritesList,toggleFavorites} = useContext(favoritesContext)

    return(
        <Link to={`/${mediaType}/${id}`}>
            <div className="search-movie-card">
                <img className="search-movie-poster" src={image == null? posterPlaceholder :`https://image.tmdb.org/t/p/w500${image}`}/>
                <button className="favorite-btn" onClick={(e) => {
                                                                e.stopPropagation()
                                                                e.preventDefault()
                                                                toggleFavorites({image, title, rating, id, year, mediaType})}}>{favoritesList.some(item => item.id === id) ? (<IoHeart size={22} color="#EF4444" />) : (<IoHeartOutline size={22} color="white" />)}</button>
                <p className="search-movie-title">{title}</p>
                <div className="card-info-row">
                    <p className="search-movie-release-date">{year} <span>|</span></p>
                    <p className="search-movie-rating"><IoStar size={16} color="#FFAD49" /><span>{rating.toFixed(1)}</span></p>
                </div>
            </div>
        </Link>
    )
}
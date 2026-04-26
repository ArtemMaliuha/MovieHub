import { IoHeartOutline, IoHeart, IoStar } from "react-icons/io5";
import { useContext } from "react";
import { favoritesContext } from "../context/FavoritesContext";
import { Link } from "react-router-dom";

export default function TrendingMovieCard({image, title, rating, id, year, mediaType}) {

    const {favoritesList,toggleFavorites} = useContext(favoritesContext)

    return(
        <Link to={`/${mediaType}/${id}`}>
            <div className="trending-movie-card">
                <img className="trending-movie-poster" src={`https://image.tmdb.org/t/p/w500${image}`}/>
                <button className="favorite-btn" onClick={(e) => {
                                                                e.stopPropagation()
                                                                e.preventDefault()
                                                                toggleFavorites({image, title, rating, id, year, mediaType})}}>{favoritesList.some(item => item.id === id) ? (<IoHeart size={22} color="#EF4444" />) : (<IoHeartOutline size={22} color="white" />)}</button>
                <p className="trending-movie-title">{title}</p>
                <div className="card-info-row">
                    <p className="trending-movie-release-date">{year} <span>|</span></p>
                    <p className="trending-movie-rating"><IoStar size={16} color="#FFAD49" /><span>{rating.toFixed(1)}</span></p>
                </div>
            </div>
        </Link>
    )
}
import actorPlaceholder from "../actor_placeholder.png"
import { Link } from "react-router-dom"

export default function CastCard({profilePic, name, id}){
    return (
        <Link to={`/person/${id}`} >
            <div className="cast-card">
                <img src={profilePic == null ? actorPlaceholder : `https://image.tmdb.org/t/p/w185${profilePic}`}/>
                <p>{name}</p>
            </div>
        </Link>
    )
}
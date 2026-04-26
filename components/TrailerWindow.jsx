import { IoClose } from "react-icons/io5"

export default function TrailerWindow({trailerKey, onClose}){

    return (
        <div className="window-overlay" onClick={onClose}>
            <div className="window-content">
                <button className="window-close-btn" onClick={onClose}><IoClose size={30} color="white" /></button>
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailerKey}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        </div>
    )
}
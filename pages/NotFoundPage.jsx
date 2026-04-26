import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function NotFoundPage() {
    return (
        <div className="not-found-container">
            <Navbar />
            <h1 className="not-found-title">404</h1>
            <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="back-home-btn">
                Back to Movies
            </Link>
        </div>
    )
}
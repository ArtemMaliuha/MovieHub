export default function Footer() {
    return (
        <footer className="footer-wrapper">
            <div className="footer-content">
                <div className="footer-left">
                    <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
                        <img 
                            className="tmdb-logo" 
                            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg" 
                            alt="TMDB Logo"
                        />
                    </a>
                </div>
                <div className="footer-right">
                    <p className="tmdb-attribution">
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                    <p className="footer-copyright">
                        © 2026 MovieHub. Created with React. Created by Artem Maliuha.
                    </p>
                </div>
            </div>
        </footer>
    )
}
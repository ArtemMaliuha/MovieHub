import Navbar from "../components/Navbar"
import { useSearchParams } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
const API_KEY = import.meta.env.VITE_API_KEY 
import SearchMovieCard from "../components/SearchMovieCard"
import Footer from "../components/Footer"

const yearArray = []

const currentYear = new Date().getFullYear()

for(let i = currentYear; i >= 1900; i--){
    yearArray.push(i)
}

export default function SearchPage() {

    const [params] = useSearchParams()
    const [page, setPage] = useState(1)
    const [searchResults, setSearchResults] = useState([])
    const [titleFilter, setTitleFilter] = useState(null)
    const [yearFilter, setYearFilter] = useState(null)
    const [ratingFilter, setRatingFilter] = useState(null)

    const query = encodeURIComponent(params.get('q'))

    function loadMore() {
        setPage(prevCount => prevCount + 1)
    }

    function handleFilterChange(e){
        const {name, value} = e.target
        
        if (name === "title") setTitleFilter(value)
        if (name === "year") setYearFilter(value)
        if (name === "rating") setRatingFilter(value)
    }

    useEffect(() => {
        setPage(1)
        setSearchResults([])
    }, [query])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&include_adult=false&language=en-US&page=${page}`)
            .then(res => res.json())
            .then(data => {
                if(data.results){
                    const filteredData = data.results.filter(item => item.media_type !== "person")

                    {setSearchResults(prev => page === 1 ? filteredData : [...prev, ...filteredData])}
                }
            })
    }, [query, page])

    const searchElement = useMemo(() => {
        const filtered = searchResults.filter(movie => {
            const releaseDate = movie.release_date || movie.first_air_date
            const matchesYear = !yearFilter || releaseDate?.startsWith(yearFilter)
            const matchesRating = !ratingFilter || movie.vote_average >= Number(ratingFilter)

            return matchesYear && matchesRating
        })

        const sorted = [ ...filtered].sort((a,b) => {
            const titleA = a.title || a.name
            const titleB = b.title || b.name

            if (titleFilter === "title-asc") return titleA.localeCompare(titleB)
            if (titleFilter === "title-desc") return titleB.localeCompare(titleA)
            return 0
        })

        return sorted.map(movie => {
            const rawYear = movie.release_date || movie.first_air_date

            const year = rawYear ? rawYear.slice(0,4) : "—"
            return <SearchMovieCard image={movie.poster_path} title={movie.title || movie.name} key={`favorites-${movie.id}`} id={movie.id} rating={movie.vote_average} year={year} mediaType={movie.media_type}/>
        })
    }, [searchResults, titleFilter, yearFilter, ratingFilter])

    return (
        <div>
            <Navbar />
            <h1 className="search-header">Search results for '{params.get('q')}'</h1>
            <div className="search-background"></div>
            <div className="filters-container">
                <select name="title" className="title-filter" onChange={handleFilterChange}>
                    <option value="">Default</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                </select>
                <select name="year" className="year-filter" onChange={handleFilterChange}>
                    <option value="">Any year</option>
                    {yearArray.map(year => {
                        return <option value={`${year}`} key={year}>{year}</option>
                    })}
                </select>
                <select name="rating" className="rating-filter" onChange={handleFilterChange}>
                    <option value="">Any rating</option>
                    <option value="9">9+</option>
                    <option value="8">8+</option>
                    <option value="7">7+</option>
                    <option value="6">6+</option>
                    <option value="5">5+</option>
                </select>
            </div>
            <div className="search-movies-cards">
                {searchElement}
            </div>
            <button className="load-more-btn" onClick={loadMore}>Load More</button>
            <Footer />
        </div>
        
    )
}
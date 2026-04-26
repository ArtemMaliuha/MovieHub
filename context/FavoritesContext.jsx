import { createContext, useState, useEffect } from "react";

export const favoritesContext = createContext()

export  function FavoritesProvider({children}) {
    
    const [favoritesList, setFavoritesList] = useState(() => {
        const storedFavoritesList = localStorage.getItem("moviehubFavorites")

        return storedFavoritesList ? JSON.parse(storedFavoritesList) : []
    })

    useEffect(() => {
        localStorage.setItem("moviehubFavorites", JSON.stringify(favoritesList))
    }, [favoritesList])

    function toggleFavorites(movie) {
        setFavoritesList((prevList => {
            const isExist = prevList.some(item => item.id === movie.id)

            if(isExist){
                return prevList.filter(item => item.id !== movie.id)
            }else{
                return [...prevList, movie]
            }
        }))
    }

    return (
        <favoritesContext.Provider value={{favoritesList, toggleFavorites}}>
            {children}
        </favoritesContext.Provider>
    )
}
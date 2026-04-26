import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/HomePage"
import FavoritesPage from "./pages/FavoritesPage"
import MovieDetailsPage from "./pages/MovieDetailsPage"
import NotFoundPage from "./pages/NotFoundPage"
import PersonDetailsPage from "./pages/PersonDetailsPage"
import SearchPage from "./pages/SearchPage"
import { FavoritesProvider } from "./context/FavoritesContext"

const router = createBrowserRouter([
  {path: "/", element: <HomePage />},
  {path: "/search", element: <SearchPage />},
  {path: "/favorites", element: <FavoritesPage />},
  {path: "/:mediaType/:id", element: <MovieDetailsPage />},
  {path: "/person/:id", element: <PersonDetailsPage />},
  {path: "*", element: <NotFoundPage />}
])

export default function App() {
  return (
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  )
}
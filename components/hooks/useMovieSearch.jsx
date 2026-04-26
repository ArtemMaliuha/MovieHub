import { useNavigate } from "react-router-dom";

export default function useMovieSearch() {
    const navigation = useNavigate()
    
    function search(input) {
        if(input && input.trim()){
            navigation(`/search?q=${encodeURIComponent(input)}`)
        }
    }

    return search
}
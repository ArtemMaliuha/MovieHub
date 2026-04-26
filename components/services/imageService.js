import posterPlaceholder from "../../poster_placeholder.png";

const API_KEY = import.meta.env.VITE_API_KEY;

async function fetchMovieId(title) {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}&language=en-US&page=1`);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
        const id = data.results[0].id;
        return await getValidPoster(id); 
    }
    
    return posterPlaceholder;
}

async function validateImage(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok && response.headers.get('content-type')?.startsWith('image');
    } catch (error) {
        return false;
    }
}

export default async function getValidPoster(input) {
    if (typeof input === "string") {
        return await fetchMovieId(input);
    }

    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${input}/images?api_key=${API_KEY}`);
        const data = await res.json();
        const posters = data.posters;

        if (posters && posters.length > 0) {
            const allowedPosters = posters.filter(p => p.iso_639_1 === 'en');
            const sortedPosters = allowedPosters.sort((a, b) => b.vote_average - a.vote_average);

            for (let i = 0; i < Math.min(sortedPosters.length, 10); i++) {
                const p = sortedPosters[i];
                const candidateUrl = `https://image.tmdb.org/t/p/w500${p.file_path}`;
                
                const isValid = await validateImage(candidateUrl);
                
                if (isValid) {
                    return p.file_path;
                } 
            }
        }

        return posterPlaceholder; 

    } catch (err) {
        return posterPlaceholder;
    }
}
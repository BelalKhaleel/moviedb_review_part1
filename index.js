import express from 'express';

const app = new express();
const PORT = 5000;

const movies = [
    { id: 1, title: 'Jaws', year: 1975, rating: 8 },
    { id: 2, title: 'Avatar', year: 2009, rating: 7.8 },
    { id: 3, title: 'Brazil', year: 1985, rating: 8 },
    { id: 4, title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }]

var currentId = 4;

app.listen(PORT, console.log(`Server Running on Port ${PORT}`))

app.use(express.json())


app.get("/test", (req, res) => {
    return res.json({ status: 200, message: "OK" })
})
app.get("/time", (req, res) => {
    const now = new Date()
    return res.json({ status: 200, message: now.getHours() + ':' + now.getMinutes() })
})
app.get("/hello/:id?", (req, res) => {
    const id = req.params.id || "";

    return res.json({ status: 200, message: `Hello, ${id}` })
})
app.get("/search", (req, res) => {
    const s = req.query.s;
    if (s) {
        return res.json({ status: 200, message: 'ok', data: s })
    }
    else {
        return res.status(500).json({ status: 500, error: true, message: `you have to provide a search` })
    }
})

app.get("/movies/read/id/:id", (req, res) => {
    const id = req.params.id;
    const i = movies.findIndex(obj => obj.id == id)
    if (i === -1) {
        return res.status(404).json({ status: 404, error: true, message: `the movie ${id} does not exist` })
    }
    else {
        return res.json({ status: 200, data: movies[i] })
    }
})
app.get("/movies/read/:sort?", (req, res) => {
    const sort = req.params.sort;
    if (!sort) {
        return res.json({ status: 200, data: movies })
    }
    else {
        let sortParam = null;
        if (sort == "by-date") {
            sortParam = "year"
        }
        if (sort == "by-title") {
            sortParam = "title"
        }
        if (sort == "by-rating") {
            sortParam = "rating"
        }
        const sortedMovies = movies.sort(function (a, b) {
            a = a[sortParam];
            b = b[sortParam];
            if (typeof a === "string") {
                a.toLowerCase();
                b.toLowerCase();
            }
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0
        })
        return res.json({ status: 200, data: sortedMovies })

    }
})
app.post("/movies/create", (req, res) => {
    const { title, year } = req.query;
    const rating = req.query.rating || 4;
    if (!(title && year) || typeof parseInt(year) !== 'number' || year.toString().length !== 4) {

        return res.json({ status: 403, error: true, message: 'you cannot create a movie without providing a title and a year' })
    }
    else {
        let movie = {};
        currentId++;
        movie.id = currentId;
        movie.title = title;
        movie.year = year;
        movie.rating = rating;
        movies.push(movie)

        return res.json({ status: 200, data: movies })
    }
})
app.delete("/movies/delete/:id", (req, res) => {
    const id = req.params.id;
    const i = movies.findIndex(obj => obj.id == id)
    if (i === -1) {
        return res.status(404).json({ status: 404, error: true, message: `the movie ${id} does not exist` })
    }
    else {
        movies.splice(i, 1)
        return res.json({ status: 200, data: movies })
    }
})
app.patch("/movies/update/:id", (req, res) => {
    const id = req.params.id;
    const i = movies.findIndex(obj => obj.id == id)
    if (i === -1) {
        return res.status(404).json({ status: 404, error: true, message: `the movie ${id} does not exist` })
    }
    else {
        const { title, year, rating } = req.query;
        let movie = movies[i];
        if (title) {
            movie.title = title
        }
        if (year) {
            movie.year = parseInt(year)
        }
        if (rating) {
            movie.rating = parseFloat(rating)
        }
        return res.json({ status: 200, data: movies })
    }
})
export default class MangaFoxApi {

    static getHotManga = (source, callback) => {

        fetch(`https://mangaparserapi.herokuapp.com/getHotMangas?source=${source}`,
            { credentials: 'same-origin' })

            .then((response) => {
                console.log("a");
                callback(null, JSON.parse(response._bodyInit));
            })
            .catch((err) => {
                console.warn(err);
            });
    }

    static getMangaInfo = (source, mangaUrl, callback) => {

        return new Promise((resolve, reject) => fetch(`https://mangaparserapi.herokuapp.com/getMangaInfo?source=${source}&mangaUrl=${mangaUrl}`,
            { credentials: 'same-origin' })
            .then((response) => {
                resolve(JSON.parse(response._bodyInit));
            })
        );
    }

    static getMangaPages = (source, chapterUrl, callback) => {

        return new Promise((resolve, reject) => fetch(`https://mangaparserapi.herokuapp.com/getMangaPages?source=${source}&chapterUrl=${chapterUrl}`,
            { credentials: 'same-origin' })

            .then((response) => {
                resolve(JSON.parse(response._bodyInit));
            })
        )
    }


    static searchManga = (source, keyword, callback) => {

        keyword = encodeURI(keyword);

        fetch(`https://mangaparserapi.herokuapp.com/searchManga?source=${source}&keyword=${keyword}`,
            { credentials: 'same-origin' })

            .then((response) => {
                callback(null, JSON.parse(response._bodyInit));
            });
    }
}
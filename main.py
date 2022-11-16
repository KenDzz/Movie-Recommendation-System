import json
import requests
import uvicorn
import pandas as pd
from fastapi import FastAPI, Request, Form
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from Recommender.main import Movie_Recommendations


API_KEY_THE_MOVIE_DB = '83698018e32f927c74f1f51dcaacc231'
language_API = 'vi'
app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
domain = ' http://127.0.0.1:8000/'

md1 = pd.read_csv('Movie-Recommender-Data/credits.csv')
md2 = pd.read_csv('Movie-Recommender-Data/movies_metadata.csv')

md1 = md1[['id', 'cast', 'crew']]
md2 = md2[['id', 'adult', 'belongs_to_collection', 'budget', 'genres', 'homepage', 'imdb_id', 'original_language',
           'original_title', 'overview', 'popularity', 'poster_path', 'production_companies',
           'production_countries', 'release_date', 'revenue', 'runtime', 'spoken_languages', 'status', 'tagline',
           'title', 'video', 'vote_average', 'vote_count']]
md1["id"] = md1["id"].astype(int)
md2["id"] = md2["id"].astype(int)

df = pd.merge(md1, md2, on="id")



@app.get("/getmovie/{page}")
def read_item(page: str):
    pageItem = page.split("-")
    result = df[int(pageItem[0]):int(pageItem[1])].sort_values(by='release_date')
    resultJs = {}
    for index, row in result.iterrows():
        info = getInfomationMovie(row['imdb_id'])
        infoJs = {row['imdb_id'] : info}
        resultJs.update(infoJs)
    return resultJs


@app.get("/recommender/{movie}")
def read_item(movie: str):
    result = Movie_Recommendations(movie,df)
    resultJs = {}
    for index, row in result.iterrows():
        info = getInfomationMovie(row['imdb_id'])
        infoJs = {row['imdb_id'] : info}
        resultJs.update(infoJs)
    return resultJs

@app.get("/tmdb/{id}")
def read_item(id: str):
    return getInfomationMovie(id)

def getInfomationMovie(idtmdb):
    URL = "https://api.themoviedb.org/3/movie/"+idtmdb
    # defining a params dict for the parameters to be sent to the API
    PARAMS = {'api_key': API_KEY_THE_MOVIE_DB, 'language': language_API}
    # sending get request and saving the response as response object
    r = requests.get(url=URL, params=PARAMS)
    # extracting data in json format
    data = r.json()
    return data;


if __name__ == "__main__":
    uvicorn.run(app, debug=True)
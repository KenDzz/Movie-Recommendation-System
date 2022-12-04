import json
import requests
import uvicorn
import pandas as pd
from fastapi import FastAPI, Request, Form
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from Recommender.main import Movie_Recommendations
from ast import literal_eval
import numpy as np

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
md3 = pd.read_csv('Movie-Recommender-Data/keywords.csv')

md1 = md1[['id', 'cast', 'crew']]
md2 = md2[['id', 'adult', 'belongs_to_collection', 'budget', 'genres', 'homepage', 'imdb_id', 'original_language',
           'original_title', 'overview', 'popularity', 'poster_path', 'production_companies',
           'production_countries', 'release_date', 'revenue', 'runtime', 'spoken_languages', 'status', 'tagline',
           'title', 'video', 'vote_average', 'vote_count']]
md3 = md3[['id', 'keywords']]

md1["id"] = md1["id"].astype(int)
md2["id"] = md2["id"].astype(int)
md3["id"] = md3["id"].astype(int)

df1 = pd.merge(md1, md2, on="id")
df= pd.merge(df1, md3, on="id")


def get_director(x):
    for i in x:
        if i['job'] == 'Director':
            return i['name']
    return np.nan

# Function to convert all strings to lower case and strip names of spaces
def clean_data(x):
    if isinstance(x, list):
        return [str.lower(i.replace(" ", "")) for i in x]
    else:
        #Check if director exists. If not, return empty string
        if isinstance(x, str):
            return str.lower(x.replace(" ", ""))
        else:
            return ''

# Returns the list top 3 elements or entire list; whichever is more.
def get_list(x):
    if isinstance(x, list):
        names = [i['name'] for i in x]
        #Check if more than 3 elements exist. If yes, return only first three. If no, return entire list.
        if len(names) > 3:
            names = names[:3]
        return names

    #Return empty list in case of missing/malformed data
    return []

features = ['cast', 'crew', 'keywords', 'genres']
for feature in features:
    df[feature] = df[feature].apply(literal_eval)

df['director'] = df['crew'].apply(get_director)

features = ['cast', 'keywords', 'genres']
for feature in features:
    df[feature] = df[feature].apply(get_list)

# Apply clean_data function to your features.
features = ['cast', 'keywords', 'director', 'genres']

for feature in features:
    df[feature] = df[feature].apply(clean_data)

def create_soup(x):
    return ' '.join(x['keywords']) + ' ' + ' '.join(x['cast']) + ' ' + x['director'] + ' ' + ' '.join(x['genres'])

df['soup'] = df.apply(create_soup, axis=1)

print(df.isnull().sum())
print(df.shape)
df.dropna(inplace=True)
df = df.reset_index(drop=True)
print(df.isnull().sum())

print(df.shape)
print(df)


@app.get("/getmovie/{page}")
def read_item(page: str):
    pageItem = page.split("-")
    result = df.sample(n = int(pageItem[1])).sort_values(by='release_date')
    resultJs = {}
    for index, row in result.iterrows():
        info = getInfomationMovie(row['imdb_id'])
        infoJs = {row['imdb_id'] : info}
        resultJs.update(infoJs)
    return resultJs


@app.get("/recommender/{movie}")
def read_item(movie: str):
    print(movie)
    result = Movie_Recommendations(movie,df)
    print(result['original_title'])
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
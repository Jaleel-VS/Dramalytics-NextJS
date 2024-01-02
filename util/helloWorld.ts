// use node-fetch to make a request to the API
import fetch from 'node-fetch';

const url = 'https://api.themoviedb.org/3/tv/1399?language=en-US';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwN2M1MWU2YTJiNWFiOGI5ODMzNzcyZjA3YjQzYmFlNiIsInN1YiI6IjY1OTEyYmE3NmFhOGUwNjIxY2VhZjEyYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8kjUuBMhaBN2u9YMRqMB-9SpIg2IKlaSRDQeBalBae0'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));
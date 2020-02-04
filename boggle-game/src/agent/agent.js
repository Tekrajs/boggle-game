import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:8080';

//const encode = encodeURIComponent;
const responseBody = res => res.body;

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;

const requests = {
    del: url =>
      superagent.del(`${API_ROOT}${url}`).then(responseBody),
    get: url =>
      superagent.get(`${API_ROOT}${url}`).then(responseBody),
    put: (url, body) =>
      superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
    post: (url, body) =>{
      return superagent.post(`${API_ROOT}${url}`)
      .set('Access-Control-Allow-Origin','*')
      .field('name', body.name)
      .field('score', body.score)
      .field('identifier', body.identifier)
      .then(responseBody=>{
        console.log(responseBody)
        return {error:false,http_code:responseBody.status,message:'done'};
      },error=>{
        let message = '';
        if(body.name.length <= 4){
          message='Name should be 5 character or more';
        }
        return {error:true,http_code:error.status,message:message};
      })
    }
  };


  const Boggles = {
    all: () =>
      requests.get(`/boggles?${limit(10, 0)}`),

    post: (...args) => requests.post(`/boggles`,args[0])
  };


  export default {
    Boggles
  };
  
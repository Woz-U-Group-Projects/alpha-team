import Home from './Home'
import Grid from './Grid'
import Redirect from './Redirect'
import { fetchPopularRepos, getUser,isLoggedin } from './api'

const routes =  [
  {
    path: '/songlist',
    component: Home,
    fetchInitialData: (cookie,query) => getUser(cookie,query)
  },
  {
    path: '/popular/:id',
    component: Grid,
    fetchInitialData: (path = '') => fetchPopularRepos(path.split('/').pop())
  },
  {
    path: '/',
    component: Redirect,
    exact:true
  }
]

export default routes
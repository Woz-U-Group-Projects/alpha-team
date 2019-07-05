import React from 'React';
import {withRouter} from 'react-router';
import { Link } from 'react-router-dom'
class Redirect extends React.Component {
  constructor(props) {
    super(props)
    if(__isBrowser__){
      window.location.href="/songlist/";
    }
    else{
    this.props.history.push('/songlist/');
    }
  }
  
  render(){
  
  return (
    <div>
      <a href="/songlist/">Check out the songlist</a>
    </div>
  )
}
}
export default withRouter(Redirect);
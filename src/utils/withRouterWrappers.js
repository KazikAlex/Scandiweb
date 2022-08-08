import { useParams } from 'react-router-dom'
import Main from '../UI/Main/Main'
import Plp from '../UI/Plp/Plp'
import Pdp from '../UI/Pdp/Pdp'

export const UseWithRouterMain = (props) => {
    const params = useParams()
    return (
        <Main params={params} {...props} />
      )
}

export const UseWithRouterPlp = (props) => {
    const params = useParams()
    return (
        <Plp params={params} {...props} />
      )
}

export const UseWithRouterPdp = (props) => {
    const params = useParams()
    return (
        <Pdp params={params} {...props} />
      )
}
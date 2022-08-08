import './plp.css'
import cartCircle from '../../utils/picture/cartCircle.svg'
import spinner from '../../utils/picture/spinner.gif'
import { Component } from 'react'
import { Link} from 'react-router-dom'

export default class Plp extends Component {

  componentDidMount() {
    this.props.getCategoryProducts(this.props.params.category)
  }
    
  componentDidUpdate(prevProps) {
    if (this.props.params.category !== prevProps.params.category) {
      this.props.getCategoryProducts(this.props.params.category)
    }
  }

  render() {
    let activeCurrency = this.props.activeCurrency

    if (this.props.categoryProducts.length < 1) {
      return (
        <div className="container">
          <img className="spinner" src={spinner} alt="spiner" />
        </div>
      )      
    }else {
      return (
        <div className="plp" onClick={() => {if (!this.props.hideCartOverlay) {this.props.toggleCartOverlay()}} } >
          <div className="container">
            <div className="category_name">
              {this.props.params.category}
            </div>
            <div className="products">
            {this.props.categoryProducts.map((category) => 
                <div className="product_item" key={category.id}>
                  <Link className="product_item_link" to={`/${category.category}/${category.id}`} >
                    <img className="product_item_img" src={category.gallery[0]} alt="product_img" />
                    {this.props.cart.find((item) => item.id === category.id) ? <img className="product_item_cart" src={cartCircle} alt="product_cart"/> : null  }                    
                  </Link>
                  <div className="product_item_name">
                    {category.name}
                  </div>
                  <div className="product_item_price">
                    {this.props.activeCurrency}
                    {category.prices.map((price) => {
                        if (price.currency.symbol === activeCurrency) {
                          return price.amount
                        }else {
                          return null
                        }
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  }
}

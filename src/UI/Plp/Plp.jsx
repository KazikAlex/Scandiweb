import { Component } from 'react'
import { Link} from 'react-router-dom'
import cartCircle from '../../utils/picture/cartCircle.svg'
import './plp.css'

class Plp extends Component {

  componentDidMount() {
    this.props.getCategoryProducts(this.props.params.category)
  }
    
  componentDidUpdate(prevProps) {
    if (prevProps.activeCategory !== this.props.activeCategory && !prevProps.hideCartOverlay && !this.props.hideCartOverlay) {this.props.toggleCartOverlay()}
    
    if (this.props.params.category !== prevProps.params.category) {
      this.props.getCategoryProducts(this.props.params.category)
    }
  }

  render() {
    let activeCurrency = this.props.activeCurrency

    return (
      <div className="plp" onClick={() => {if (!this.props.hideCartOverlay) {this.props.toggleCartOverlay()}} } >
        <div className="container">
          <div className="category_name">
            {this.props.params.category}
          </div>
          <div className="products">
          {this.props.categoryProducts.map((product) => 
              <div className="product_item" key={product.id + product.name}>            
                <Link className="product_item_link" to={`/${product.category}/${product.id}`} >
                  <div className="product_item_img">
                    <img className="product_item_img_main" src={product.gallery[0]} alt="product_img" />
                    {this.props.cart.find((item) => item.id === product.id) ? <img className="product_item_cart" src={cartCircle} alt="product_cart"/> : null  }     
                  </div>  
                </Link>
                <div className="product_item_brand">
                  {product.brand}
                </div>

                <div className="product_item_name">
                  {product.name}
                </div>
                <div className="product_item_price">
                  {this.props.activeCurrency}
                  {product.prices.map((price) => {
                      if (price.currency.symbol === activeCurrency) {
                        return price.amount
                      }else {
                        return null
                      }
                    }
                  )}
                  <div className="product_item_instock">{product.inStock ? '': 'Out of Stock'}</div>
                  <div className="pdp_item_info_button" 
                    onClick={() => {
                      this.props.getProduct(product.id) 
                      this.props.addToCart(JSON.parse(JSON.stringify(product)))
                    }}>
                    ADD TO CART
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Plp;

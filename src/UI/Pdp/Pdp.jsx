import { Component } from 'react'
import sliderUp from '../../utils/picture/sliderUp.svg'
import sliderDown from '../../utils/picture/sliderDown.svg'
import './pdp.css'

export default class Pdp extends Component {

  componentDidMount() {
    this.props.getProduct(this.props.params.id)
    this.props.setToZerroSlideIndex()
  }

  componentDidUpdate() {
    if (this.props.params.id !== this.props.product.id) {
      this.props.getProduct(this.props.params.id)
    }
  }

  render() {
    return (
      <div className="pdp" onClick={() => {if (!this.props.hideCartOverlay) {this.props.toggleCartOverlay()}} } >
        <div className="container">
          <div className="pdp_item">
            <div className="pdp_item_gallery"> 
              <div className="pdp_item_gallery_arrow_wrapper">
                <img 
                  className={this.props.product.gallery.length < 3 || this.props.slideIndex === 0 ? "pdp_item_gallery_up hide" : "pdp_item_gallery_up"} 
                  src={sliderUp} 
                  alt="sliderUp"
                  onClick={() => this.props.sliderClick('up')}
                />
              </div>  
              {this.props.product.gallery.length > 3 
                ? this.props.slider()
                : this.props.product.gallery.map((img, key) => 
                  <img className="plp_item_small_img" 
                    key={key+img} 
                    src={img} 
                    alt="product_img" 
                    onClick={() => this.props.setActiveImg(key)} />
                )
              }
              <div className="pdp_item_gallery_arrow_wrapper">
                <img 
                  className={this.props.product.gallery.length < 3 || this.props.slideIndex === this.props.product.gallery.length - 3 ? "pdp_item_gallery_down hide" : "pdp_item_gallery_down"} 
                  src={sliderDown} 
                  alt="sliderDown" 
                  onClick={() => this.props.sliderClick('down')}
                /> 
              </div>
            </div>
            <div className="pdp_item_big_img">
              <img src={this.props.product.gallery[this.props.activeImg]} alt="product_img" />
            </div>
            <div className="pdp_item_info">
              <div className="pdp_item_info_name">{this.props.product.name}</div>
              <div className="pdp_item_info_brand">{this.props.product.brand}</div>
              <div className="pdp_item_info_atributes">
                {this.props.product.attributes.map((atr, key) => 
                  <div key={key+atr.id}>
                    <div className="pdp_item_info_atributes_name">{atr.name}:</div>
                    <div className="pdp_item_info_atributes_items">
                      {atr.items.map((item, key) => 
                        atr.type === 'swatch'
                        ?
                        <div className={item.active ? "pdp_item_info_atributes_items_item_swatch active_attribute_color" : "pdp_item_info_atributes_items_item_swatch"}
                          key={key+item.id}
                          style={{backgroundColor: item.value}}
                          onClick={() => this.props.setActiveAttribute(atr.name, item.id)} 
                        >
                        </div>
                        :
                        <div className={item.active ? "pdp_item_info_atributes_items_item active_attribute" : "pdp_item_info_atributes_items_item"}
                          key={key+item.id} 
                          onClick={() => this.props.setActiveAttribute(atr.name, item.id)} 
                        >
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="pdp_item_info_price">
                <div className="pdp_item_info_price_name">PRICE:</div>
                <div className="pdp_item_info_price_amount">
                  {this.props.activeCurrency}
                  {this.props.product.prices.map((price) => {
                        if (price.currency.symbol === this.props.activeCurrency) {
                          return price.amount
                        }else {
                          return null
                        }
                      }
                    )}
                </div>
                <div className="product_item_instock">{this.props.product.inStock ? '': 'Out of Stock'}</div>
              </div>
              <div className="pdp_item_info_button" onClick={() => this.props.addToCart(JSON.parse(JSON.stringify(this.props.product)))}>ADD TO CART</div>
              <div className="pdp_item_info_description" >{this.props.htmlToReact(this.props.product.description)}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

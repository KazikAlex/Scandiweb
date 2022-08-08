import { Component } from 'react'
import spinner from '../../utils/picture/spinner.gif'
import sliderUp from '../../utils/picture/sliderUp.svg'
import sliderDown from '../../utils/picture/sliderDown.svg'
import './pdp.css'

export default class Pdp extends Component {

  componentDidMount() {
    this.props.getProduct(this.props.params.id)
    this.props.setToZerroSlideIndex()
  }

  render() {
    if (this.props.product.gallery === undefined) {
      return (
        <div className="container">
          <img className="spinner" src={spinner} alt="spiner" />
        </div>
      )       
    }else {
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
                  ? ( this.props.slider()
                  )
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
              <img className="pdp_item_big_img" src={this.props.product.gallery[this.props.activeImg]} alt="product_img" />
              <div className="pdp_item_info">
                <div className="pdp_item_info_name">{this.props.product.name}</div>
                <div className="pdp_item_info_brand">{this.props.product.brand}</div>
                <div className="pdp_item_info_atributes">
                  {this.props.product.attributes.map((atr, key) => 
                    <div key={key+atr.id}>
                      <div className="pdp_item_info_atributes_name">{atr.name}:</div>
                      <div className="pdp_item_info_atributes_items">
                        {atr.items.map((item, key) => 
                          <div className={(item.active !== true) ? "pdp_item_info_atributes_items_item" : (atr.name === 'Color') ? "pdp_item_info_atributes_items_item active_attribute color" : "pdp_item_info_atributes_items_item active_attribute" }
                              key={key+item.id} 
                              style={atr.name === 'Color' ? {backgroundColor: item.value, width: 32 + 'px', height: 32 + 'px'} : {}}
                              onClick={() => this.props.setActiveAttribute(atr.name, item.id)} 
                            >
                            {atr.type === 'text' ? item.value : ""}
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
                </div>
                <div className="pdp_item_info_button" onClick={() => this.props.addToCart(JSON.parse(JSON.stringify(this.props.product)))}>ADD TO CART</div>
                <div className="pdp_item_info_description" dangerouslySetInnerHTML={{ __html: this.props.product.description }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

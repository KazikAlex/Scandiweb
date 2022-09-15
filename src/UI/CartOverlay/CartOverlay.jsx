import { Component } from 'react'
import { Link } from 'react-router-dom'
import plus from '../../utils/picture/plus.svg'
import minus from '../../utils/picture/minus.svg'
import leftArrow from '../../utils/picture/leftArrow.svg'
import rightArrow from '../../utils/picture/rightArrow.svg'
import './cartOverlay.css'

export default class CartOverlay extends Component {

  componentDidMount() {
    this.props.totalItemCartCounter()
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.activeCurrency !== prevProps.activeCurrency || 
      this.props.cartTotalQuantity !== prevProps.cartTotalQuantity || 
      this.props.itemCartQuantity !== prevProps.itemCartQuantity ) {
      this.props.totalItemCartCounter()
    }
  } 
  
  render() {
    return (
        <div className={this.props.hideCartOverlay ? "cart_overlay hide" : "cart_overlay"  }>
        <div className="cart_overlay_header">
          My Bag, {this.props.cartTotalQuantity} items
        </div>
        <div className="cart_overlay_items">
          {this.props.cart.map((item, itemKey) => 
            <div className="main_cart_item" key={item.id + itemKey}>
              <div className="main_cart_item_info">
                <div className="main_cart_item_info_name">{item.name}</div>
                <div className="main_cart_item_info_brand">{item.brand}</div>
                <div className="main_cart_item_info_amount">
                  {this.props.activeCurrency}
                  {item.prices.map((price) => {
                      if (price.currency.symbol === this.props.activeCurrency) {
                        return price.amount
                      }else {
                        return null
                      }
                    }
                  )}
                </div>
                <div className="pdp_item_info_atributes">
                  {item.attributes.map((atr, atrKey) => 
                    <div key={atr.id + atrKey}>
                      <div className="main_item_info_atributes_name">{atr.name}:</div>
                      <div className="pdp_item_info_atributes_items">
                        {atr.items.map((itemsItem, itemsItemKey) => 
                          atr.type === 'swatch'
                          ?
                          <div className={itemsItem.active ? "pdp_item_info_atributes_items_item_swatch active_attribute_color" : "pdp_item_info_atributes_items_item_swatch"}
                            key={itemsItem.id + itemsItemKey}
                            style={{backgroundColor: itemsItem.value}}
                            onClick={() => this.props.setActiveAttributeInCart(item.id, atr.id, itemsItem.id, item.attributes)}
                          >
                          </div>
                          :
                          <div className={itemsItem.active ? "pdp_item_info_atributes_items_item active_attribute" : "pdp_item_info_atributes_items_item"}
                            key={itemsItem.id + itemsItemKey}
                            onClick={() => this.props.setActiveAttributeInCart(item.id, atr.id, itemsItem.id, item.attributes)}
                          >
                            {itemsItem.value}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="main_cart_item_img">
                <div className="main_cart_item_img_quantity">
                  <img className="main_cart_item_img_quantity_symbol" 
                      src={plus} 
                      alt="plus" 
                      onClick={() => this.props.setQuantityInCart('plus', itemKey)} 
                      />
                    <div className="main_cart_item_img_quantity_number">{item.quantity}</div>
                  <img className="main_cart_item_img_quantity_symbol" 
                    src={minus} 
                    alt="minus" 
                    onClick={() => this.props.setQuantityInCart('minus', itemKey)} 
                    />
                </div>
                <div className="main_cart_item_img_pictue_wrapper">
                  <img className="main_cart_item_img_pictue" src={item.gallery[item.ativeImg]} alt="product" />
                  <img className={item.gallery.length > 1 ? "main_cart_item_img_pictue_right" : "main_cart_item_img_pictue_right hide"} 
                    src={rightArrow} 
                    alt="right" 
                    onClick={() => this.props.setActiveImgInOverlay(item.gallery.length, itemKey, "right")}
                  />
                  <img className={item.gallery.length > 1 ? "main_cart_item_img_pictue_left" : "main_cart_item_img_pictue_left hide"} 
                    src={leftArrow} 
                    alt="left"
                    onClick={() => this.props.setActiveImgInOverlay(item.gallery.length, itemKey, "left")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="cart_overlay_buttons">
          <Link className="cart_overlay_buttons_view" to="/cart" onClick={() => this.props.toggleCartOverlay()}  >view bag</Link>
          <div className="cart_overlay_buttons_check" onClick={() => this.props.toggleCartOverlay()} >check out</div>
        </div>
      </div>
    )
  }
}

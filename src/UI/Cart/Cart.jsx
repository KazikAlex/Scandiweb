import { Component } from 'react'
import plus from '../../utils/picture/plus.svg'
import minus from '../../utils/picture/minus.svg'
import './cart.css'

export default class Cart extends Component {

  componentDidMount() {
    this.props.totalItemCartCounter()
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeCurrency !== prevProps.activeCurrency || this.props.cartQuantity !== prevProps.cartQuantity || this.props.itemCartQuantity !== prevProps.itemCartQuantity ) {
      this.props.totalItemCartCounter()
    }
  }

  render() {
    return (
      <div className="cart" onClick={() => {if (!this.props.hideCartOverlay) {this.props.toggleCartOverlay()}} } >
        <div className="container">
          <div className="cart_name">CART</div>
          {this.props.cart.map((item, key) => 
            <div className="cart_item" key={item.id}>
              <div className="cart_item_info">
                <div className="cart_item_info_name">{item.name}</div>
                <div className="cart_item_info_brand">{item.brand}</div>
                <div className="cart_item_info_amount">
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
                  {item.attributes.map((atr) => 
                    <div key={atr.id}>
                      <div className="pdp_item_info_atributes_name">{atr.name}:</div>
                      <div className="pdp_item_info_atributes_items">
                        {atr.items.map((itemsItem) => 
                          <div className={(itemsItem.active !== true) ? "pdp_item_info_atributes_items_item" : (atr.name === 'Color') ? "pdp_item_info_atributes_items_item active_attribute color" : "pdp_item_info_atributes_items_item active_attribute" }
                              key={itemsItem.id} 
                              style={atr.name === 'Color' ? {backgroundColor: itemsItem.value, width: 32 + 'px', height: 32 + 'px'} : {}} 
                              onClick={() => this.props.setActiveAttributeInCart(item.id, atr.id, itemsItem.id, item.attributes)} 
                              >
                            {atr.type === 'text' ? itemsItem.value : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="cart_item_img">
                <div className="cart_item_img_quantity">
                  <img className="cart_item_img_quantity_symbol" 
                        src={plus} alt="plus" 
                        onClick={() => this.props.setQuantityInCart('plus', key)} 
                      />
                    <div className="cart_item_img_quantity_number">{item.quantity}</div>
                  <img className="cart_item_img_quantity_symbol" 
                      src={minus} alt="minus" 
                      onClick={() => this.props.setQuantityInCart('minus', key)} 
                    />
                </div>
                <img className="cart_item_img_pictue" src={item.gallery[0]} alt="product" />
              </div>
            </div>
          )}
          <div className="cart_order">
            <div className="cart_order_item">
              <div className="cart_order_name">Tax 21%: </div>
              <div className="cart_order_value"> {this.props.activeCurrency} {(this.props.cartTotalTax).toFixed(2)}</div>
            </div>
            <div className="cart_order_item">
              <div className="cart_order_name">Quantity: </div>
              <div className="cart_order_value"> {this.props.cartTotalQuantity}
              </div>
            </div>
            <div className="cart_order_item">
              <div className="cart_order_name">Total: </div>
              <div className="cart_order_value"> {this.props.activeCurrency} {(this.props.cartTotal).toFixed(2)}</div>
            </div>
            <div className="cart_order_button">ORDER</div>
          </div>
        </div>
      </div>
    )
  }
}

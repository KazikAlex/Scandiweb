import './main.css'
import { Component } from 'react'
import CartOverlay from '../CartOverlay/CartOverlay'
import logo from '../../utils/picture/logo.svg'
import cart from '../../utils/picture/cart.svg'
import arrowDown from '../../utils/picture/arrowDown.svg'
import arrowUp from '../../utils/picture/arrowUp.svg'
import { NavLink, Outlet } from 'react-router-dom'

class Main extends Component {

  componentDidMount() {
    this.props.getHeaderInfo()
  }

  componentDidUpdate(prevProps) {
    if ( this.props.categories.length < 1 ) {
      this.props.getHeaderInfo()
    }
    if (this.props.cartQuantity !== prevProps.cartQuantity) {
      this.setState({...this.state, cartQuantity: this.props.cartQuantity})
    }
  }

  render() {
    return (
      <div className="main">
        <div className="container">
          <div className='header'>
            <div className='menu'>
                {this.props.categories.map((category, key) => 
                  <NavLink key={key} to={`/${category.name}`} >{category.name} </NavLink>
                )}                     
            </div>
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="cart_currency">
                <div className="currency">
                  <div className="currency_current" 
                      onClick={() => {
                          this.props.toggleHideSelect()
                        }
                      }  
                      >
                    <div className="currency_current_symbol">{this.props.activeCurrency}</div>
                    <img className="currency_current_arrow" src={this.props.hideSelect ? arrowDown : arrowUp} alt="arrow" />
                  </div>
                  <div className={this.props.hideSelect ? "currency_select hide" : "currency_select"  } >
                    {this.props.currencies.map((currency, key) => 
                        <div className="currency_option" 
                            key={key}  
                            onClick={(e) => {
                                e.stopPropagation()
                                this.props.currencySelect(currency.symbol)
                              }
                            } 
                          >
                          {currency.symbol} {currency.label}
                        </div>
                    )}
                  </div>
                </div>
                <div className="main_cart">
                  <img className="main_cart_img" src={cart} alt="cart" onClick={() => this.props.toggleCartOverlay()} />
                    {this.props.cart.length > 0 
                      ? <div className="main_cart_quantity">{this.props.cartQuantity}</div>
                      : ''
                    } 

                  <CartOverlay {...this.props} />

                </div>
              </div>
            </div>
          </div>
          <Outlet onClick={() => {
              if (!this.state.hideCartOverlay) {this.toggleCartOverlay()} 
            }}  />
      </div>
    )
  }
}

export default Main;
import './App.css'
import React, { Component } from 'react'
import Plp from './UI/Plp/Plp'
import Cart from './UI/Cart/Cart'
import Page404 from './UI/Page404/Page404'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Query, client } from '@tilework/opus'
import { SpinnerComponent, UseWithRouter} from './utils/withRouterWrappers'
import Main from './UI/Main/Main'
import Pdp from './UI/Pdp/Pdp'
import { nanoid } from 'nanoid'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      activeCategory: '',
      currencies: [], 
      activeCurrency: '',
      categoryProducts: [],
      product: {},
      cart: [],
      itemCartQuantity: 1,
      hideSelect: true,
      hideCartOverlay: true,
      activeImg: 0,
      activeImgInOverlay: 0,
      activeAttribute: {},
      slideIndex: 0,
      changeAttributeInCart: {},
      cartTotalQuantity: 0,
      cartTotalTax: 0,
      cartTotal: 0
    }
  
    this.getHeaderInfo = this.getHeaderInfo.bind(this)
    this.getCategoryProducts = this.getCategoryProducts.bind(this)
    this.getProduct = this.getProduct.bind(this)
    this.toggleHideSelect = this.toggleHideSelect.bind(this)
    this.currencySelect = this.currencySelect.bind(this)
    this.addToCart = this.addToCart.bind(this)
    this.setActiveImg = this.setActiveImg.bind(this)
    this.setActiveAttribute = this.setActiveAttribute.bind(this)
    this.toggleCartOverlay = this.toggleCartOverlay.bind(this)
    this.slider = this.slider.bind(this)
    this.sliderClick = this.sliderClick.bind(this)
    this.setToZerroSlideIndex = this.setToZerroSlideIndex.bind(this)
    this.setActiveAttributeInCart = this.setActiveAttributeInCart.bind(this)
    this.totalItemCartCounter = this.totalItemCartCounter.bind(this)
    this.setQuantityInCart = this.setQuantityInCart.bind(this)
    this.setActiveImgInOverlay =this.setActiveImgInOverlay.bind(this)
    this.htmlToReact = this.htmlToReact.bind(this)
  }

  componentDidUpdate(prevProps) {
    if ( this.state.categories.length < 1) {
      this.getHeaderInfo()
    }

    if (this.state.cart.length > 0 && this.state.cartTotal === 0)
    this.totalItemCartCounter()
  }

  getHeaderInfo = async () => {
    client.setEndpoint('http://localhost:4000/')
    const query = new Query(
      `categories { 
        name } 
      currencies { 
        label 
        symbol 
      }
      `
    )
    const response = await client.post(query )

    this.setState(
      {
        ...this.state, 
        categories: response.categories, 
        currencies: response.currencies,
        activeCurrency: response.currencies[0].symbol, 
        activeCategory: response.categories[0].name,
      })
  }

  getCategoryProducts = async (category) => {
    client.setEndpoint('http://localhost:4000/')
    const query = new Query(
      `category(input: {title: "${category}"}) {
        products {
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            id
            name
            type
            items {
              id
              displayValue
              value
            }
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
          brand
        }
      }
      `
    )
    const response = await client.post(query)
      
    try {
      const products = JSON.parse(JSON.stringify(response.category.products))

      products.map((poduct) => 
        poduct.attributes.map((atr) => 
          atr.items.map((item, index) =>
            index === 0 ? item.active = true : item.active = false
          )
        )
      )

      this.setState({
        ...this.state, 
        categoryProducts: products,
        activeCategory: category
      })
    } catch {
      <Navigate to="/page404"  />
    }
    
  }

  getProduct = async (productId) => {
    let newProduct = await this.state.categoryProducts.find((product) => productId === product.id )
      try {
        this.setState({...this.state, product: newProduct})

      }catch(e) {
        console.log(e)
      }
  }

  htmlToReact(htmlInput) {
    const HtmlToReactParser = require('html-to-react').Parser;
    const htmlToReactParser = new HtmlToReactParser();
    const reactElement = htmlToReactParser.parse(htmlInput);
    return reactElement
  }

  toggleHideSelect() {
    this.setState({...this.state, hideSelect: !this.state.hideSelect})
  }

  toggleCartOverlay() {
    this.setState({...this.state, hideCartOverlay: !this.state.hideCartOverlay})
  }

  currencySelect(selectedCurrency) {
    this.totalItemCartCounter()
    this.setState({...this.state, activeCurrency: selectedCurrency, hideSelect: true})
  }

  setActiveImg(number) {
    this.setState({...this.state, activeImg: number})
  }

  setActiveImgInOverlay(length, itemNumber, dirrection) {
    let newCart = this.state.cart

    dirrection === 'left' 
    ? newCart[itemNumber].ativeImg === 0 
    ? newCart[itemNumber].ativeImg = length - 1
    : newCart[itemNumber].ativeImg = newCart[itemNumber].ativeImg- 1
    : newCart[itemNumber].ativeImg === length - 1
    ? newCart[itemNumber].ativeImg = 0 
    : newCart[itemNumber].ativeImg = newCart[itemNumber].ativeImg + 1

    this.setState({...this.state, cart: newCart})
  }

  setActiveAttribute(attributeId, itemsId) {
    this.state.product.attributes.map((atr) => 
      atr.id === attributeId ? atr.items.map((item) => item.id === itemsId ? item.active = true : item.active = false) : null
    )
    this.setState({...this.state, activeAttribute: {attributeId, itemsId}})
  }

  setActiveAttributeInCart(productId, attributesId, itemsId, attributes) {
    this.state.cart.some((productInCart) => {
      if(productInCart.id === productId && JSON.stringify(productInCart.attributes) === JSON.stringify(attributes)) {
        productInCart.attributes.some((atr) => {
          if(atr.id === attributesId) {
            atr.items.forEach((item) => {
              if(item.id === itemsId) {
                item.active = true
              }else {
                item.active = false
              }
            })
          }
          return null
        })
      }
      return this.setState({...this.state, changeAttributeInCart: itemsId})
    })
  }

  setToZerroSlideIndex() {
    this.setState({...this.state, slideIndex: 0, activeImg: 0})
  }

  addToCart(newItem) {
    if (newItem.inStock) {
      if (this.state.cart.length === 0 ) {
        newItem.quantity = 1
        newItem.ativeImg = 0
        newItem.id = newItem.id + nanoid(7)
        this.state.cart.push(JSON.parse(JSON.stringify(newItem)))
        this.setState({...this.state, cartTotalQuantity: this.state.cartTotalQuantity + 1, 
        })
      }else {
        let plusQuantity = this.state.cart.find((item) => item.id === newItem.id && JSON.stringify(item.attributes) === JSON.stringify(newItem.attributes) )
  
        if (plusQuantity !== undefined) {
          plusQuantity.quantity += 1
          this.setState({...this.state, itemCartQuantity : this.state.itemCartQuantity + 1, cartTotalQuantity: this.state.cartTotalQuantity + 1})
        }else {
          newItem.quantity = 1
          newItem.ativeImg = 0
          newItem.id = newItem.id + nanoid(7)
          this.state.cart.push(JSON.parse(JSON.stringify(newItem)))
          this.setState({
            ...this.state, 
            cartTotalQuantity: this.state.cartTotalQuantity + 1
          })
        }
      } 
    }
  }

  slider() {
    const smallImgArray = []

    for(let i = this.state.slideIndex; i < this.state.slideIndex + 3; i++) {
      smallImgArray.push(<img className="plp_item_small_img"  
        key={i}
        src={this.state.product.gallery[i]} 
        alt="product_img" 
        onClick={() => this.setActiveImg(i)} />)
    }
    
    return smallImgArray
  }

  sliderClick(direction) {
    direction === 'up' ? this.setState({...this.state, slideIndex: this.state.slideIndex - 1}) : this.setState({...this.state, slideIndex: this.state.slideIndex + 1})
  }

  totalItemCartCounter() {
    let quantity = 0
    let total = 0
    let tax = 0
    let newCart = this.state.cart

    newCart.map((item) => {
      quantity += item.quantity
      item.prices.filter((price) => {
        if (price.currency.symbol === this.state.activeCurrency) {
          total += price.amount * item.quantity
        }
        return null
      })
      return null
    })

    tax += total / 121* 21

    this.setState({...this.state, cart: newCart, cartTotal: total, cartTotalQuantity: quantity, cartTotalTax: tax})
  }

  setQuantityInCart(direction, key) {
    let foundItem = this.state.cart.find((item, index) => index === key)

    if(direction === 'plus') {
      foundItem.quantity = foundItem.quantity + 1
      this.setState({
        ...this.state, 
        itemCartQuantity: foundItem.quantity, 
        cartTotalQuantity: this.state.cartTotalQuantity + 1, 
      })
    }else {
      if(foundItem.quantity === 1) {
        this.state.cart.splice(key, 1)
        this.setState({
          ...this.state, 
          itemCartQuantity: foundItem.quantity, 
          cartTotalQuantity: this.state.cartTotalQuantity - 1, 
          cartTotal: 0, 
          cartTotalTax: 0, 
        })
      }else {
        foundItem.quantity = foundItem.quantity - 1 
        this.setState({
          ...this.state, 
          itemCartQuantity: foundItem.quantity, 
          cartTotalQuantity: this.state.cartTotalQuantity - 1, 
        })
      }
    }
  }

  render() {
    return (
      <div 
        className={this.state.hideCartOverlay ? "app" : "app_overlay"} 
        onClick={(e) => {
            if(!this.state.hideSelect) {this.toggleHideSelect()}
            if(!this.state.hideCartOverlay && e.target.className === "app_overlay") {
              this.toggleCartOverlay(e)
            }
          }
        } 
      >
        <Routes>

          <Route path="/" element={ 
            !this.state.activeCategory
            ?
            <SpinnerComponent 
              {...this.state} 
              getHeaderInfo={this.getHeaderInfo} 
              getCategoryProducts = {this.getCategoryProducts} 
              getProduct = {this.getProduct}
            />
            :
            <Navigate to={this.state.activeCategory && `/${this.state.activeCategory}`}  /> } 
          />

          <Route path="/:category" 
            element={ 
              this.state.categoryProducts < 1 
              ?
              <SpinnerComponent 
                {...this.state} 
                getHeaderInfo={this.getHeaderInfo} 
                getCategoryProducts = {this.getCategoryProducts} 
                getProduct = {this.getProduct}  
              />
              :
              <UseWithRouter {...this.state} >
                <Main 
                  {...this.state}
                  {...this.props}
                  toggleHideSelect = {this.toggleHideSelect}  
                  currencySelect = {this.currencySelect}  
                  toggleCartOverlay = {this.toggleCartOverlay}  
                  totalItemCartCounter = {this.totalItemCartCounter} 
                  setQuantityInCart = {this.setQuantityInCart}
                  setActiveImgInOverlay = {this.setActiveImgInOverlay}
                  setActiveAttributeInCart = { this.setActiveAttributeInCart}

                />
                <Plp
                  {...this.state} 
                  {...this.props}  
                  getHeaderInfo = {this.getHeaderInfo} 
                  getCategoryProducts = {this.getCategoryProducts} 
                  getProduct = {this.getProduct} 
                  toggleCartOverlay = {this.toggleCartOverlay} 
                  addToCart = {this.addToCart} 

                  totalItemCartCounter = {this.totalItemCartCounter} 
                  currencySelect = {this.currencySelect}
                  toggleHideSelect = {this.toggleHideSelect}
                  setActiveAttribute = {this.setActiveAttribute} 
                  setActiveAttributeInCart = {this.setActiveAttributeInCart} 
                  setQuantityInCart = {this.setQuantityInCart}
                  setActiveImgInOverlay = {this.setActiveImgInOverlay}
                />
              </UseWithRouter>
              
            }
          />        
          <Route path="/:category/:id" 
            element={ 
              this.state.product.id === undefined 
              ?
              <SpinnerComponent 
                {...this.state}
                getHeaderInfo={this.getHeaderInfo} 
                getCategoryProducts = {this.getCategoryProducts} 
                getProduct = {this.getProduct}
              />
              
              :
              <UseWithRouter >
                  <Main 
                    {...this.state}
                    {...this.props}
                    toggleHideSelect = {this.toggleHideSelect}  
                    currencySelect = {this.currencySelect}  
                    toggleCartOverlay = {this.toggleCartOverlay}  
                    totalItemCartCounter = {this.totalItemCartCounter} 
                    setQuantityInCart = {this.setQuantityInCart}
                    setActiveImgInOverlay = {this.setActiveImgInOverlay}
                    setActiveAttributeInCart = { this.setActiveAttributeInCart}
                  />
                  <Pdp  
                    {...this.state} 
                    {...this.props}  
                    getProduct = {this.getProduct} 
                    addToCart = {this.addToCart} 
                    setActiveImg = {this.setActiveImg}
                    setActiveAttribute = {this.setActiveAttribute} 
                    slider = {this.slider} 
                    sliderClick = {this.sliderClick}
                    setToZerroSlideIndex = {this.setToZerroSlideIndex}
                    toggleCartOverlay = {this.toggleCartOverlay} 
                    htmlToReact = {this.htmlToReact}
                    totalItemCartCounter = {this.totalItemCartCounter} 
                    getHeaderInfo = {this.getHeaderInfo} 
                    getCategoryProducts = {this.getCategoryProducts} 
                    currencySelect = {this.currencySelect}
                    toggleHideSelect = {this.toggleHideSelect}
                    setActiveAttributeInCart = {this.setActiveAttributeInCart} 
                    setQuantityInCart = {this.setQuantityInCart}
                    setActiveImgInOverlay = {this.setActiveImgInOverlay}
                />
              </UseWithRouter>
              
            } 
          />       

          <Route path="/cart" 
            element={
              <UseWithRouter>
                <Main 
                  {...this.state}
                  {...this.props}
                  toggleHideSelect = {this.toggleHideSelect}  
                  currencySelect = {this.currencySelect}  
                  toggleCartOverlay = {this.toggleCartOverlay}  
                  totalItemCartCounter = {this.totalItemCartCounter} 
                  setQuantityInCart = {this.setQuantityInCart}
                  setActiveImgInOverlay = {this.setActiveImgInOverlay}
                  setActiveAttributeInCart = { this.setActiveAttributeInCart}
                />
              <Cart 
                {...this.state} 
                {...this.props}  
                setActiveAttributeInCart = {this.setActiveAttributeInCart} 
                toggleCartOverlay = {this.toggleCartOverlay}
                totalItemCartCounter = {this.totalItemCartCounter}
                setQuantityInCart = {this.setQuantityInCart}
              />
              </UseWithRouter>
            } 
          />

          <Route path="/page404" element={<Page404 />} />

        </Routes>
      </div>
    )
  }
}

export default App;
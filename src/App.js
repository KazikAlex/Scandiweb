import './App.css'
import { Component } from 'react'
import Cart from './UI/Cart/Cart'
import Page404 from './UI/Page404/Page404'
import { Route, Routes } from 'react-router-dom'
import { Query, client } from '@tilework/opus'
import { UseWithRouterMain, UseWithRouterPlp, UseWithRouterPdp } from './utils/withRouterWrappers'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      currencies: [],
      activeCurrency: '',
      categoryProducts: [],
      product: {},
      cart: [],
      cartQuantity: 0,
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
  }

  componentDidMount() {
    this.getHeaderInfo()
  }


  getHeaderInfo = async () => {
    client.setEndpoint('http://localhost:4000/')
    const query = new Query(
      `categories { 
        name } 
      currencies { 
        label 
        symbol 
      }`
    )
    const response = await client.post(query )
    this.setState({...this.state, categories: response.categories, currencies: response.currencies, activeCurrency: response.currencies[0].symbol })
  }

  getCategoryProducts = async (category) => {
    client.setEndpoint('http://localhost:4000/')
    const query = new Query(`
      category(input: {title: "${category}"}) {
        products {
          id
          name
          gallery 
          category
          prices {
            currency {
              label
              symbol
            }
            amount
          }
        }
      } 
    `)
  
    try {
      const response = await client.post(query)
      this.setState({...this.state, categoryProducts: response.category.products})
    }catch {
      console.log('error')
      window.location.href = "/page404"
    }
  }
  

  getProduct = async (id) => {
    client.setEndpoint('http://localhost:4000/')
    const query = new Query(`
      product(id: "${id}") {
        id
        name
        inStock
        gallery
        description
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
      `)

    try {
      const response = await client.post(query )

      const newProduct = JSON.parse(JSON.stringify(response.product))
  
      newProduct.attributes.map((atr, index) => 
        atr.items.map((item, index) => 
          index === 0 ? item.active = true : item.active = false
        )
      )
      
      this.setState({...this.state, product: newProduct})
    }catch {
      console.log('error')
    }

    
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
    if (this.state.cart.length === 0 ) {
      newItem.quantity = 1
      newItem.ativeImg = 0
      this.state.cart.push(JSON.parse(JSON.stringify(newItem)))
      this.setState({...this.state, cartQuantity: this.state.cartQuantity + 1})
    }else {
      let plusQuantity = this.state.cart.find((item) => item.id === newItem.id && JSON.stringify(item.attributes) === JSON.stringify(newItem.attributes) )

      if (plusQuantity !== undefined) {
        plusQuantity.quantity += 1
        this.setState({...this.state, itemCartQuantity : this.state.itemCartQuantity + 1})
      }else {
        newItem.quantity = 1
        newItem.ativeImg = 0
        this.state.cart.push(JSON.parse(JSON.stringify(newItem)))
        this.setState({...this.state, cartQuantity: this.state.cartQuantity + 1})
      }
    } 
  }

  slider() {
    const smallImgArray = []

    for(let i = this.state.slideIndex; i < this.state.slideIndex + 3; i++) {
      smallImgArray.push(<img className="plp_item_small_img" 
        key={this.state.product.gallery[i].id} 
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
      this.setState({...this.state, itemCartQuantity: foundItem.quantity})
    }else {
      if(foundItem.quantity === 1) {
        this.state.cart.splice(key, 1)
        this.setState({...this.state, itemCartQuantity: foundItem.quantity, cartQuantity: this.state.cartQuantity - 1})
      }else {
        foundItem.quantity = foundItem.quantity - 1 
        this.setState({...this.state, itemCartQuantity: foundItem.quantity})
      }
    }
  }

  render() {
    return (
      <div className="App" 
          onClick={() => {if(!this.state.hideSelect) {this.toggleHideSelect()}}} >
        <Routes>
          <Route path="/" element={<UseWithRouterMain
              {...this.state}  
              getHeaderInfo = {this.getHeaderInfo} 
              currencySelect = {this.currencySelect}
              toggleHideSelect = {this.toggleHideSelect}
              toggleCartOverlay = {this.toggleCartOverlay} 
              setActiveAttribute = {this.setActiveAttribute} 
              setActiveAttributeInCart = {this.setActiveAttributeInCart} 
              setQuantityInCart = {this.setQuantityInCart}
              setActiveImgInOverlay = {this.setActiveImgInOverlay}
              /> }>
            <Route path="/:category" element={<UseWithRouterPlp 
              {...this.state} 
              getCategoryProducts = {this.getCategoryProducts} 
              toggleCartOverlay = {this.toggleCartOverlay} 
              /> }
            />        
            <Route path="/:category/:id" element={<UseWithRouterPdp  
              {...this.state} 
              getProduct = {this.getProduct} 
              addToCart = {this.addToCart} 
              setActiveImg = {this.setActiveImg}
              setActiveAttribute = {this.setActiveAttribute} 
              slider = {this.slider} 
              sliderClick = {this.sliderClick}
              setToZerroSlideIndex = {this.setToZerroSlideIndex}
              toggleCartOverlay = {this.toggleCartOverlay} 
              />} 
            />       
            <Route path="/cart" element={<Cart 
              {...this.state} 
              setActiveAttributeInCart = {this.setActiveAttributeInCart} 
              toggleCartOverlay = {this.toggleCartOverlay}
              totalItemCartCounter = {this.totalItemCartCounter}
              setQuantityInCart = {this.setQuantityInCart}
              />} />
            <Route path="*" element={<Page404 />} />
          </ Route >
        </Routes>
      </div>
    )
  }
}

export default App;
import React from 'react'
import { useParams } from 'react-router-dom'
import spinner from './picture/spinner.gif'

export const UseWithRouter = (props) => {
  const params = useParams()
  const childrenWithProps = props.children.map((child, key) =>  React.cloneElement(child, {props: props, params: params, key: key}) )

  return (
    <div>
      {childrenWithProps}
    </div>
  )
}

export const SpinnerComponent = (props) => {
  const params = useParams()

  if (props.categories.length < 1) {
    props.getHeaderInfo()
  }

  if (props.categories.length > 0 && props.categoryProducts.length < 1) {
    props.getCategoryProducts(params.category)
  }
  
  if (props.categoryProducts.length > 0 && props.product.id === undefined) { 
    props.getProduct(params.id)
  }

  return (
    <div className="container">
      <img className="spinner" src={spinner} alt="spiner" />
    </div>
  )
}
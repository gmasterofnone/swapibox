import React, { Component } from 'react';
import './Card.css'
import cardImage from './../Utils/cardImage.js';
import { updateFavorites } from '../Utils/API';



class Card extends Component {
  constructor() {
    super()
    this.state = {
      favorite: false
    }
  }

  componentDidMount() {
    const { favorite } = this.props.cardData
    return favorite ? this.setState({ favorite }) : null
  }

  render() {
    const { cardData } = this.props
    const { name } = this.props.cardData;
    const description = Object.keys(cardData).map((spec, index) => {
      if (spec !== 'type' && spec !== 'name' && spec !== 'favorite' && !Array.isArray(cardData[spec])) {
        return <li key={Date.now() + index}>{spec}: {cardData[spec]}</li>
      } else if (Array.isArray(cardData[spec])) {
        return <li key={Date.now() + index}>{spec}: {cardData[spec].join(', ')}</li>
      }
      return '';
    })

    return(
      <div className='card'>
        <div className='image-container'>
          <div className='favorite-btn' 
            onClick={() => updateFavorites(name)}></div>
          <img src={`${cardImage[name]}`} alt={name} className='character-pic'/>
        </div>
        <div className='card-info'>
          <h4 className='character-name'>{name.toUpperCase()}</h4>
          <ul>
            { description }
          </ul>
        </div>
      </div>
    )
  }
}

export default Card;
export const filterCards = async (type) => {
  let result;
  switch (type) {
    case checkLocalStorage(type):
      result = checkLocalStorage(type)
      break;
    case 'films':
      result = await fetchData(type, getFilms)
      break;
    case 'people':
      result = await fetchData(type, getPeople)
      break;
    case 'planets':
      result = await fetchData(type, getPlanets)
      break;
    case 'vehicles':
      result = await fetchData(type, getVehicles)
      break;
    default: updateFavorites(type) 
  }
  return result;
}

const fetchData = async (url, func) => {
  const response = await fetch(`https://swapi.co/api/${url}`);
  const data = await response.json();
  const results = await func(data.results)
  return results  
}

const checkLocalStorage = (value) => {
  if (localStorage.getItem('cards')) {
    const cards = JSON.parse(localStorage.getItem('cards'))
    const result = cards.filter(card => {
      if (card.value === 'favorite') {
        return card.favorite === true
      } else {
        return card.type === value
      }
    })
    return result.length > 0 ? result : false;
  } else {
    return false
  }
}

const updateFavorites = (name) => {
  const cards = JSON.parse(localStorage.getItem('cards'))
  cards.forEach(card => { 
    return card[name] ? card.favorite = !card.favorite : '' 
  })
  localStorage.setItem('cards', JSON.stringify(cards))
}

const getFilms = async (data) => {
  return data;
}

const getPeople = async data => {
  const unresolvedPromises = data.map(async character => {
    const worldResponse = await fetch(character.homeworld)
    const homeworld = await worldResponse.json()
    const speciesResponse = await fetch(character.species)
    const species = await speciesResponse.json()

    return { name: character.name,
             homeworld: homeworld.name, 
             species: species.name, 
             population: numberWithCommas(homeworld.population),
             type: 'people',
             favorite: false 
            }
  })
  return Promise.all(unresolvedPromises);
}

const getPlanets = async data => {
  const unresolvedPromises = data.map(async planet => {
    if (planet.residents.length) {
      const residentResponse = await getResidents(planet.residents)  
      return { name: planet.name,
        terrain: planet.terrain,
        climate: planet.climate, 
        population: numberWithCommas(planet.population), 
        residents: residentResponse,
        type: 'planets',
        favorite: false 
       }  
    }
    return { name: planet.name,
             terrain: planet.terrain,
             climate: planet.climate, 
             population: numberWithCommas(planet.population), 
             residents: 'none',
             type: 'planets',
             favorite: false 
            }
  })
  return Promise.all(unresolvedPromises);
}

const getResidents = async residents => {
  const unresolvedPromises = residents.map(async resident => {
    const response = await fetch(resident)
    const result = await response.json()
    return result.name
  })
  return Promise.all(unresolvedPromises)
}

const getVehicles = async data => {
  const results = data.map( vehicle => {
    return { 
      name: vehicle.name,
      model: vehicle.model, 
      class: vehicle.vehicle_class, 
      Passengers: vehicle.passengers,
      type: 'vehicle',
      favorite: false 
    }
  })
  return results;
}

const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const filterCards = async (type) => {
  let result;
  if (checkLocalStorage(type)) {
    return checkLocalStorage(type)
  } else if (type === 'films') {
    result = await fetchData(type, getFilm)
  } else if (type === 'people') {
    result = await fetchData(type, getPeople)
  }
  return result;
}

const fetchData = async (url, func) => {
  const response = await fetch(`https://swapi.co/api/${url}`);
  const data = await response.json();
  const results = await func(data.results)
  return results  
}

const getFilm = async (data) => {
  return data;
}

const checkLocalStorage = (category) => {
  if (localStorage.getItem('cards')) {
    const cards = JSON.parse(localStorage.getItem('cards'))
    const result = cards.filter(card => card.type === category)
    return result.length > 0 ? result : false;
    // ????
  } else {
    return false
  }
}

const getPeople = async data => {
  const unresolvedPromises = data.map(async character => {
    const worldResponse = await fetch(character.homeworld)
    const homeworld = await worldResponse.json()
    const speciesResponse = await fetch(character.species)
    const species = await speciesResponse.json()

    return { name: character.name, homeworld: homeworld.name, species: species.name, population: homeworld.population, type: 'people' }
  })
  return Promise.all(unresolvedPromises);
}


import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { useState } from 'react'
import { arrPriceRanges } from '../../util/idxToPriceRange'
import classes from './properties.module.css'
import { useEffect } from 'react'
import { continentToIdx } from '../../util/idxToContinent'
import { request } from '../../util/fetchAPI'
import PropertyCard from '../propertyCard/PropertyCard'

const Properties = () => {
  const [allProperties, setAllProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [state, setState] = useState(null)
  const query = (useLocation().search).slice(1) // slice(1) to remove "?"
  const arrQuery = query.split("&")
  const navigate = useNavigate()

  // fetch all properties
  useEffect(() => {
    const fetchAllProperties = async() => {
      const data = await request(`/property/getAll`, 'GET')
      setAllProperties(data)
    }
    fetchAllProperties()
  }, [])

  // parsing query params
  useEffect(() => {
    if (arrQuery && allProperties?.length > 0 && state === null) {
      console.log('query')
      let formattedQuery = {}
      arrQuery.forEach((option, idx) => {
        const key = option.split("=")[0]
        const value = option.split("=")[1]

        formattedQuery = { ...formattedQuery, [key]: value }

        // if we are on the last index, assign the formattedQuery obj to state
        if (idx === arrQuery.length - 1) {
          setState(prev => formattedQuery)
          console.log(formattedQuery)
          handleSearch(formattedQuery)
        }
      })
    }
  }, [allProperties, arrQuery])


  const handleState = (e) => {
    setState(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }


  const handleSearch = (param) => {
    let options;
   console.log(`params;${param}`)
  
    if (param?.nativeEvent) {
      options = state;
    } else {
      options = param;
    }
 
      
  const filteredProperties = allProperties.filter((property) => {
      const priceRange = options['priceRange'];
      const minPrice = Number(priceRange.split('-')[0]);
       const maxPrice = Number(priceRange.split('-')[1]);
       var continent=-1;
    if(property.continent!==undefined){

    continent = continentToIdx(property?.continent);}
    else{
    continent=-1;
    }

    return (
      property.type === options.type &&
      continent === Number(options.continent) &&
      property.price >= minPrice &&
      property.price <= maxPrice
    );
  });
    const queryStr = `type=${options.type}&continent=${options.continent}&priceRange=${options.priceRange}`;
  
    navigate(`/properties?${queryStr}`, { replace: true });
    setFilteredProperties(filteredProperties);
  };
  


  return (
    
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.options}>
          <select value={state?.type} name="type" onChange={handleState}>
            <option disabled>Select type</option>
            <option value="beach">Beach</option>
            <option value="mountain">Mountain</option>
            <option value="village">Village</option>
          </select>
          <select value={state?.priceRange} name="priceRange" onChange={handleState}>
            <option disabled>Select Price Range</option>
            <option value="0-100000">0-100,000</option>
            <option value="100000-200000">100,000-200,000</option>
            <option value="200000-300000">200,000-300,000</option>
            <option value="300000-400000">300,000-400,000</option>
            <option value="400000-500000">400,000-500,000</option>
          </select>
          <select value={state?.continent} name="continent" onChange={handleState}>
          <option disabled>Select District</option>
                 <option value='chennai'>chennai</option>
                 <option value='madurai'>madurai</option>
                 <option value='Tiruchi'>Tiruchi</option>
                 <option value='coimbator'>coimbator</option>
                 <option value='salem'>salem</option>
                 <option value='palani'>palani</option>
          </select>
          <button className={classes.searchBtn}>
            <AiOutlineSearch className={classes.searchIcon} onClick={handleSearch} />
          </button>
        </div>
        {filteredProperties?.length > 0 ?
          <>
            <div className={classes.titles}>
              <h5>Selected properties</h5>
              <h2>Property you may like</h2>
            </div>
            <div className={classes.properties}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property?._id} property={property}/>
              ))}
            </div>
          </> : <h2 className={classes.noProperty}>We have no properties with the specified options.</h2>}
      </div>
    </div>
  )
}

export default Properties
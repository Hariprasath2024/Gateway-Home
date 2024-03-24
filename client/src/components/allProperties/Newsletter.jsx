import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { useState } from 'react'
import classes from './newsletter.module.css'
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

  // // parsing query params
  // useEffect(() => {
  //   if (arrQuery && allProperties?.length > 0 && state === null) {
  //     console.log('query')
  //     let formattedQuery = {}
  //     arrQuery.forEach((option, idx) => {
  //       const key = option.split("=")[0]
  //       const value = option.split("=")[1]

  //       formattedQuery = { ...formattedQuery, [key]: value }

  //       // if we are on the last index, assign the formattedQuery obj to state
  //       if (idx === arrQuery.length - 1) {
  //         setState(prev => formattedQuery)
  //         console.log(formattedQuery)
  //         handleSearch(formattedQuery)
  //       }
  //     })
  //   }
  // }, [allProperties, arrQuery])


  // const handleState = (e) => {
  //   setState(prev => {
  //     return { ...prev, [e.target.name]: e.target.value }
  //   })
  // }


  // const handleSearch = (param) => {
  //   let options;
  //  console.log(`params;${param}`)
  
  //   if (param?.nativeEvent) {
  //     options = state;
  //   } else {
  //     options = param;
  //   }
 
      
  // const filteredProperties = allProperties.filter((property) => {
  //     const priceRange = options['priceRange'];
  //     const minPrice = Number(priceRange.split('-')[0]);
  //      const maxPrice = Number(priceRange.split('-')[1]);
  //      var continent=-1;
  //   if(property.continent!==undefined){

  //   continent = continentToIdx(property?.continent);}
  //   else{
  //   continent=-1;
  //   }

  //   return (
  //     property.type === options.type &&
  //     continent === Number(options.continent) &&
  //     property.price >= minPrice &&
  //     property.price <= maxPrice
  //   );
  // });
  //   const queryStr = `type=${options.type}&continent=${options.continent}&priceRange=${options.priceRange}`;
  
  //   navigate(`/properties?${queryStr}`, { replace: true });
  //   setFilteredProperties(filteredProperties);
  // };
  


  return (
    
    <div className={classes.container}>
      <div className={classes.wrapper}>
    
        {allProperties?.length > 0 ?
          <>
            <div className={classes.titles}>
              <h5>Selected properties</h5>
              <h2>Property you may like</h2>
            </div>
            <div className={classes.properties}>
              {allProperties.map((property) => (
                <PropertyCard key={property?._id} property={property}/>
              ))}
            </div>
          </> : <h2 className={classes.noProperty}>We have no properties with the specified options.</h2>}
      </div>
    </div>
  )
}

export default Properties
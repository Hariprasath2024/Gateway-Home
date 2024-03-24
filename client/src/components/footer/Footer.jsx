import React from 'react'
import classes from './footer.module.css'

const Footer = () => {
  return (
    <footer>
      
      <div className={classes.wrapper}>
      <section id='about'>
        <div className={classes.col}>
          <h2>About the App</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam illum quam optio autem suscipit incidunt dicta dolorum eum dolores recusandae laboriosam expedita quo facilis, numquam et.
            Delectus atque dolorum sapiente.
          </p>
        </div>
        </section>
        <div className={classes.col}>
        <h2>Contacts</h2>
        <span>Phone: 9629049191</span>
         <span><a href="https://linkedin.com/in/hari-prasath-394a1324a/">LinkedIn</a></span>
        <span><a href="https://github.com/Hariprasath2024">GitHub</a></span>
         <span><a href="mailto:n.hariprasath901513@gmail.com">Gmail</a></span>
</div>

        <div className={classes.col}>
          <h2>Location</h2>          
          <span>Country: India</span>
          <span>State:TamilNaud</span>
          <span>Current Location: Namakkal</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
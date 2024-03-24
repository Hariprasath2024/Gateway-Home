const verifyToken = require('../middlewares/verifyToken')
const Property = require('../models/Property')
const User = require('../models/User')
const propertyController = require('express').Router()


propertyController.get('/getAll', async (req, res) => {
    try {
        const properties = await Property.find({}).populate("currentOwner", '-password')

        console.log(properties)

        return res.status(200).json(properties)
    } catch (error) {
        console.error(error)
    }
})


propertyController.get('/find/featured', async (req, res) => {
    try {
        const featuredProperties = await Property.find({ featured: true }).populate("currentOwner", '-password')
        return res.status(200).json(featuredProperties)
    } catch (error) {
        return res.status(500).json(error)
    }
})


propertyController.get('/find', async (req, res) => {
    const type = req.query
    let properties = []
    try {
        if (type) {
            properties = await Property.find(type).populate("owner", '-password')
        } else {
            properties = await Property.find({})
        }

        return res.status(200).json(properties)
    } catch (error) {
        return res.status(500).json(error)
    }
})


propertyController.get('/find/types', async (req, res) => {
    try {
        const beachType = await Property.countDocuments({ type: 'beach' })
        const mountainType = await Property.countDocuments({ type: 'mountain' })
        const villageType = await Property.countDocuments({ type: 'village' })

        return res.status(200).json({ beach: beachType, mountain: mountainType, village: villageType })
    } catch (error) {
        return res.status(500).json(error)
    }
})


propertyController.get('/find/my-properties', verifyToken, async (req, res) => {
    try {
        const properties = await Property.find({ currentOwner: req.user.id })

        return res.status(200).json(properties)
    } catch (error) {
        console.error(error)
    }
})


propertyController.get('/find/bookmarked-properties', verifyToken, async (req, res) => {
    try {
        const properties = await Property.find({ bookmarkedUsers: { $in: [req.user.id] } })

        return res.status(200).json(properties)
    } catch (error) {
        console.error(error)
    }
})


propertyController.get('/find/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('currentOwner', '-password')

        if (!property) {
            throw new Error('No such property with that id')
        } else {
            return res.status(200).json(property)
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})



propertyController.post('/', verifyToken, async (req, res) => {
    try {
        const newProperty = await Property.create({ ...req.body, currentOwner: req.user.id })

        return res.status(201).json(newProperty)
    } catch (error) {
        return res.status(500).json(error)
    }
})


propertyController.put('/:id', verifyToken, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        if (property.currentOwner.toString() !== req.user.id) {
            throw new Error("You are not allowed to update other people's properties")
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )


        return res.status(200).json(updatedProperty)
    } catch (error) {
        return res.status(500).json(error)
    }
})


propertyController.put('/bookmark/:id', verifyToken, async (req, res) => {
    try {
        let property = await Property.findById(req.params.id)
        if (property.currentOwner.toString() === req.user.id) {
            throw new Error("You are not allowed to bookmark your project")
        }


        if (property.bookmarkedUsers.includes(req.user.id)) {
            property.bookmarkedUsers = property.bookmarkedUsers.filter(id => id !== req.user.id)
            await property.save()
        } else {
            property.bookmarkedUsers.push(req.user.id)

            await property.save()
        }

        return res.status(200).json(property)
    } catch (error) {
        return res.status(500).json(error)
    }
})


propertyController.delete('/:id', verifyToken, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        if (property.currentOwner.toString() !== req.user.id) {
            throw new Error("You are not allowed to delete other people properties")
        }

        await property.delete()

        return res.status(200).json({ msg: "Successfully deleted property" })
    } catch (error) {
        return res.status(500).json(error)
    }
})
propertyController.post('/send-email', async (req, res) => {
    const { from } = req.body;
  
   
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'n.hariprasath901513@gmail.com', // Your Gmail address
        pass: 'hari@devil001', // Your Gmail password
      },
    });
  
    try {
        let info = await transporter.sendMail({
        from: from, // sender address
        to: 'n.hariprasath901513@gmail.com', // list of receivers
        subject: 'Details of Customer', // Subject line
        text: 'Customer details...', // plain text body
      });
  
      console.log('Email sent: ' + info.response);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    }
  });

module.exports = propertyController
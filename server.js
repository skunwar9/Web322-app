const express = require('express');
const path = require('path');
const storeService = require('./store-service');  

const app = express();


app.use(express.static('public'));


const PORT = process.env.PORT || 8080;


storeService.initialize()
    .then(() => {
       
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
       
        console.error('Error initializing data:', err);
        process.exit(1);  
    });


app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});


app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(publishedItems => {
            res.json(publishedItems);  
        })
        .catch(err => {
            res.status(500).json({ message: err });  
        });
});


app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then(items => {
            res.json(items);  
        })
        .catch(err => {
            res.status(500).json({ message: err });  
        });
});

app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(categories => {
            res.json(categories);  
        })
        .catch(err => {
            res.status(500).json({ message: err });  
        });
});


app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

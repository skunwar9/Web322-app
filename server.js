const express = require('express');
const path = require('path');
const storeService = require('./store-service');  // Import store-service module

const app = express();

// Serve static files from 'public' folder
app.use(express.static('public'));

// Port configuration
const PORT = process.env.PORT || 8080;

// Initialize the store-service and only start the server if successful
storeService.initialize()
    .then(() => {
        // If initialization is successful, start the server
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        // If there is an error during initialization, log the error
        console.error('Error initializing data:', err);
        process.exit(1);  // Exit the process with a failure code
    });

// Route for the root path that redirects to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Route to serve about.html
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route to get all published items (published === true)
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(publishedItems => {
            res.json(publishedItems);  // Send the published items as JSON
        })
        .catch(err => {
            res.status(500).json({ message: err });  // Send error message as JSON
        });
});


app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then(items => {
            res.json(items);  // Send all items as JSON
        })
        .catch(err => {
            res.status(500).json({ message: err });  // Send error message as JSON
        });
});

app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(categories => {
            res.json(categories);  // Send all categories as JSON
        })
        .catch(err => {
            res.status(500).json({ message: err });  // Send error message as JSON
        });
});

// Custom 404 route for unmatched routes
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

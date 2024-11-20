/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Shristi Kunwar____ Student ID: __115687238__ Date: ___1/11/2024___
*
*  Web App URL: http://shristi.quiblix.ca
* 
*  GitHub Repository URL: https://github.com/skunwar9/Web322-app
*
********************************************************************************/


const express = require('express');
const path = require('path');
const storeService = require('./store-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const expressEjsLayouts = require('express-ejs-layouts');

// Default layout

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'doxlmyf70',
    api_key: '431382676145445',
    api_secret: 'RQjjpm6jnjoVXjKSAdn8VEYMBro',
    secure: true
});

const app = express();
const upload = multer();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressEjsLayouts);
app.set('layout', 'layouts/main');

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    res.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    res.locals.viewingCategory = req.query.category;
    next();
});



const PORT = process.env.PORT || 8080;


app.use(express.static(path.join(__dirname, 'public')));

storeService.initialize()
    .then(() => {
        app.listen(process.env.PORT || 8080, () => {
            console.log("Express http server listening on port", process.env.PORT || 8080);
        });
    })
    .catch((err) => {
        console.error('Error initializing data:', err);
        process.exit(1);
    });
// Routes
app.get('/', (req, res) => {
    res.redirect('/shop');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/shop', async (req, res) => {
    try {
        let items = [];
        if (req.query.category) {
            items = await storeService.getPublishedItemsByCategory(req.query.category);
        } else {
            items = await storeService.getPublishedItems();
        }

        const categories = await storeService.getCategories();

        res.render("shop", {
            data: {
                items: items,
                categories: categories
            }
        });
    } catch (err) {
        res.render("shop", {
            data: {
                message: "no results",
                categories: []
            }
        });
    }
});

// New shop/:id route
app.get('/shop/:id', async (req, res) => {
    try {
        // Get the post by id
        let item = await storeService.getItemById(req.params.id);

        // Get the published items
        let items = [];
        if (req.query.category) {
            // If category was provided, get items from that category
            items = await storeService.getPublishedItemsByCategory(req.query.category);
        } else {
            // Otherwise get all published items
            items = await storeService.getPublishedItems();
        }

        // Get the categories
        let categories = await storeService.getCategories();

        // Render the "shop" view with all of our data
        res.render("shop", {
            data: {
                item: item, // specific item for this route
                items: items,
                categories: categories
            }
        });

    } catch (err) {
        res.render("shop", {
            data: {
                message: "no results",
                categories: []
            }
        });
    }
});


app.get('/items', async (req, res) => {
    try {
        const { category, minDate } = req.query;
        let items;

        if (category) {
            items = await storeService.getItemsByCategory(category);
        } else if (minDate) {
            items = await storeService.getItemsByMinDate(minDate);
        } else {
            items = await storeService.getAllItems();
        }

        res.render("items", { items: items });
    } catch (err) {
        res.render("items", { message: "no results" });
    }
});

app.get('/item/:id', (req, res) => {
    const { id } = req.params;
    storeService.getItemById(id)
        .then(item => res.json(item))
        .catch(err => res.status(500).json({ message: err }));
});


app.get('/categories', async (req, res) => {
    try {
        const categories = await storeService.getCategories();
        res.render("categories", { categories: categories });
    } catch (err) {
        res.render("categories", { message: "no results" });
    }
});

app.get('/items/add', (req, res) => {
    res.render('addItem');
});

app.post('/items/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processItem(uploaded.url);
        }).catch(err => {
            console.error("Upload failed:", err);
            res.status(500).send("Upload Error");
        });
    } else {
        processItem("");
    }

    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;

        // Call the addItem function and handle promise resolution
        storeService.addItem(req.body).then((newItem) => {
            res.redirect('/items'); // Redirect to items listing after adding
        }).catch(err => {
            console.error("Error adding item:", err);
            res.status(500).send("Item Creation Error");
        });
    }
});


app.use((req, res) => {
    res.status(404).render('404');
});


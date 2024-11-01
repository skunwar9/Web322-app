const express = require('express');
const path = require('path');
const storeService = require('./store-service');  
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: 'doxlmyf70',
    api_key: '431382676145445',
    api_secret: 'RQjjpm6jnjoVXjKSAdn8VEYMBro',
    secure: true
});

const upload = multer(); 

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
    const { category, minDate } = req.query;

    if (category) {
        storeService.getItemsByCategory(category)
            .then(items => res.json(items))
            .catch(err => res.status(500).json({ message: err }));
    } else if (minDate) {
        storeService.getItemsByMinDate(minDate)
            .then(items => res.json(items))
            .catch(err => res.status(500).json({ message: err }));
    } else {
        storeService.getAllItems()
            .then(items => res.json(items))
            .catch(err => res.status(500).json({ message: err }));
    }
});

app.get('/item/:id', (req, res) => {
    const { id } = req.params;
    storeService.getItemById(id)
        .then(item => res.json(item))
        .catch(err => res.status(500).json({ message: err }));
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
//added new route 
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addItem.html'));
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
    res.status(404).send("Page Not Found");
});

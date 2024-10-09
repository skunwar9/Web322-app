const fs = require('fs');
const path = require('path');


let items = [];
let categories = [];

function initialize() {
    return new Promise((resolve, reject) => {
       
        fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading items file:', err);
                reject('Unable to read items file');
                return;
            }
            if (data.trim().length === 0) {
                console.error('items.json is empty');
                reject('items.json is empty');
                return;
            }

            try {
                items = JSON.parse(data);  
                console.log('Successfully parsed items.json');
            } catch (e) {
                console.error('Error parsing items.json:', e);
                reject('Error parsing items.json: ' + e.message);
                return;
            }

            
            fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading categories file:', err);
                    reject('Unable to read categories file');
                    return;
                }
                if (data.trim().length === 0) {
                    console.error('categories.json is empty');
                    reject('categories.json is empty');
                    return;
                }

                try {
                    categories = JSON.parse(data);  
                    console.log('Successfully parsed categories.json');
                    resolve();  
                } catch (e) {
                    console.error('Error parsing categories.json:', e);
                    reject('Error parsing categories.json: ' + e.message);
                }
            });
        });
    });
}


function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            console.error('No items found');
            reject('No items found');
        } else {
            resolve(items);  
        }
    });
}


function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length === 0) {
            console.error('No published items found');
            reject('No published items found');
        } else {
            resolve(publishedItems);  
        }
    });
}


function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            console.error('No categories found');
            reject('No categories found');
        } else {
            resolve(categories);  
        }
    });
}


module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
};

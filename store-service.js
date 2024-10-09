const fs = require('fs');
const path = require('path');

// Global arrays to store items and categories
let items = [];
let categories = [];

function initialize() {
    return new Promise((resolve, reject) => {
        // Read the items.json file
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
                items = JSON.parse(data);  // Parse items JSON
                console.log('Successfully parsed items.json');
            } catch (e) {
                console.error('Error parsing items.json:', e);
                reject('Error parsing items.json: ' + e.message);
                return;
            }

            // Read the categories.json file
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
                    categories = JSON.parse(data);  // Parse categories JSON
                    console.log('Successfully parsed categories.json');
                    resolve();  // Resolve when both files are successfully parsed
                } catch (e) {
                    console.error('Error parsing categories.json:', e);
                    reject('Error parsing categories.json: ' + e.message);
                }
            });
        });
    });
}

// Function to return all items
function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            console.error('No items found');
            reject('No items found');
        } else {
            resolve(items);  // Resolve with the full items array
        }
    });
}

// Function to return only published items
function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length === 0) {
            console.error('No published items found');
            reject('No published items found');
        } else {
            resolve(publishedItems);  // Resolve with the array of published items
        }
    });
}

// Function to return all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            console.error('No categories found');
            reject('No categories found');
        } else {
            resolve(categories);  // Resolve with the full categories array
        }
    });
}

// Export all functions so they can be used in server.js
module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
};

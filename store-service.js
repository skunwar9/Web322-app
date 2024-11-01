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

function addItem(itemData) {
    return new Promise((resolve, reject) => {
        // Set published status to false if undefined
        itemData.published = itemData.published !== undefined ? itemData.published : false;

        // Assign a new id based on the length of the items array
        itemData.id = items.length + 1;

        // Add itemData to the items array
        items.push(itemData);

        // Resolve with the newly added itemData
        resolve(itemData);
    });
}

function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => item.category === Number(category));
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject('No results returned');
        }
    });S
}


function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const dateFilter = new Date(minDateStr);
        const filteredItems = items.filter(item => new Date(item.postDate) >= dateFilter);
        filteredItems.length > 0 ? resolve(filteredItems) : reject('No items found with this minimum date');
    });
}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        const item = items.find(item => item.id === parseInt(id));
        item ? resolve(item) : reject('Item not found');
    });
}

module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories,
    addItem,
    getItemsByCategory,
    getItemsByMinDate,
    getItemById // Ensure this is added to exports
};

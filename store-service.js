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
const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8', (err, itemData) => {
            if (err) {
                reject('Unable to read items file');
                return;
            }

            try {
                items = JSON.parse(itemData);

                fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, categoryData) => {
                    if (err) {
                        reject('Unable to read categories file');
                        return;
                    }

                    try {
                        categories = JSON.parse(categoryData);
                        resolve();
                    } catch (e) {
                        reject(`Error parsing categories.json: ${e.message}`);
                    }
                });
            } catch (e) {
                reject(`Error parsing items.json: ${e.message}`);
            }
        });
    });
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        items.length > 0 ? resolve(items) : reject('No items found');
    });
}

function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        publishedItems.length > 0 ? resolve(publishedItems) : reject('No published items found');
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        categories.length > 0 ? resolve(categories) : reject('No categories found');
    });
}

// New function for getting published items by category
function getPublishedItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const publishedItemsByCategory = items.filter(item =>
            item.published === true && item.category === Number(category)
        );
        publishedItemsByCategory.length > 0 ?
            resolve(publishedItemsByCategory) :
            reject('No published items found for this category');
    });
}

function addItem(itemData) {
    return new Promise((resolve, reject) => {
        // Set published status to false if undefined
        itemData.published = itemData.published || false;

        // Add the current date in YYYY-MM-DD format
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
        const day = currentDate.getDate();
        itemData.postDate = `${year}-${month}-${day}`;

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
        filteredItems.length > 0 ? resolve(filteredItems) : reject('No items found for this category');
    });
}

function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const filteredItems = items.filter(item => new Date(item.postDate) >= minDate);
        filteredItems.length > 0 ? resolve(filteredItems) : reject('No items found after this date');
    });
}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        const item = items.find(item => item.id === Number(id));
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
    getItemById,
    getPublishedItemsByCategory
};
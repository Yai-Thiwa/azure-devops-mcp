const { getWorkItemsByIds } = require("../azure");

async function getWorkItem(id) {

    const items = await getWorkItemsByIds([id]);

    return items.length ? items[0] : null;
}

module.exports = {
    getWorkItem
};
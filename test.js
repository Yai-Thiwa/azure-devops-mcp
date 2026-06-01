require("dotenv").config();

const {
    getCurrentSprintWorkItems
} = require("./azure");

async function main() {

    try {
        const items = await getCurrentSprintWorkItems();
        console.log(items.length);
    } catch (e) {
        console.log("STATUS:", e.response?.status);
        console.log("DATA:", JSON.stringify(e.response?.data, null, 2));
    }
}

main().catch(console.error);
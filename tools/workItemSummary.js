const listWorkItems = require("./listWorkItems");

module.exports = async function () {

    const items = await listWorkItems(500);

    const summary = {
        total: items.length,
        byState: {},
        byType: {}
    };

    for (const item of items) {

        const state =
            item.fields["System.State"] || "Unknown";

        const type =
            item.fields["System.WorkItemType"] || "Unknown";

        summary.byState[state] =
            (summary.byState[state] || 0) + 1;

        summary.byType[type] =
            (summary.byType[type] || 0) + 1;
    }

    return summary;
};
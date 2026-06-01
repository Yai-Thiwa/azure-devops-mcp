const { runWIQL } = require("../azure");

module.exports = async function (limit = 100, project) {

    const query = `
    SELECT
      [System.Id]
    FROM WorkItems
    WHERE
      [System.WorkItemType] = 'Bug'
      AND [System.State] <> 'Closed'
      AND [System.State] <> 'Done'
  `;

    return runWIQL(query, project, limit);
};
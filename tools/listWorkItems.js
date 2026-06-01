const { runWIQL } = require("../azure");

module.exports = async function listWorkItems(limit = 50) {

    const query = `
    SELECT
      [System.Id]
    FROM WorkItems
    WHERE
      [System.TeamProject] = @project
    ORDER BY
      [System.ChangedDate] DESC
  `;

    return runWIQL(query, limit);
};
const { runWIQL } = require("../azure");

module.exports = async function listWorkItems(limit = 50, project) {

    const query = `
    SELECT
      [System.Id]
    FROM WorkItems
    WHERE
      [System.TeamProject] = @project
    ORDER BY
      [System.ChangedDate] DESC
  `;

    return runWIQL(query, project, limit);
};
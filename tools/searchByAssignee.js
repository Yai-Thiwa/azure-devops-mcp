const { runWIQL } = require("../azure");

module.exports = async function (name, limit = 100, project) {

    const query = `
    SELECT
      [System.Id]
    FROM WorkItems
    WHERE
      [System.AssignedTo] CONTAINS '${name}'
  `;

    return runWIQL(query, project, limit);
};
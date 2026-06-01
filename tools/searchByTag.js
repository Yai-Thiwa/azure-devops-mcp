const { runWIQL } = require("../azure");

module.exports = async function (tag, limit = 100, project) {

    const query = `
    SELECT
      [System.Id]
    FROM WorkItems
    WHERE
      [System.Tags] CONTAINS '${tag}'
  `;

    return runWIQL(query, project, limit);
};
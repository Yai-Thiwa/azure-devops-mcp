const { getWorkItemWithProject } = require("../azure");

module.exports = async function getWorkItem(id, project) {
    return getWorkItemWithProject(id, project);
};

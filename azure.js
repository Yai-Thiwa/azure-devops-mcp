require("dotenv").config();

const axios = require("axios");

const org = process.env.AZURE_DEVOPS_ORG;
const project = process.env.AZURE_DEVOPS_PROJECT;
const pat = process.env.AZURE_DEVOPS_PAT;

const auth = Buffer.from(`:${pat}`).toString("base64");

const api = axios.create({
    baseURL: `https://dev.azure.com/${org}`,
    headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
    }
});

const DEFAULT_FIELDS = [
    "System.Id",
    "System.Title",
    "System.State",
    "System.Tags",
    "System.WorkItemType",
    "System.AssignedTo",
    "System.CreatedDate",
    "System.ChangedDate"
];

async function getWorkItemsByIds(ids) {

    if (!ids || ids.length === 0) {
        return [];
    }

    const batches = [];

    for (let i = 0; i < ids.length; i += 200) {
        batches.push(ids.slice(i, i + 200));
    }

    const results = [];

    for (const batch of batches) {

        const res = await api.get(
            `/_apis/wit/workitems`,
            {
                params: {
                    ids: batch.join(","),
                    fields: DEFAULT_FIELDS.join(","),
                    "api-version": "7.1"
                }
            }
        );

        results.push(...res.data.value);
    }

    return results;
}

async function getWorkItem(id) {

    const res = await api.get(
        `/_apis/wit/workitems/${id}`,
        {
            params: {
                fields: DEFAULT_FIELDS.join(","),
                "api-version": "7.1"
            }
        }
    );

    return res.data;
}

async function getWorkItemWithProject(id, projectOverride) {

    const targetProject = projectOverride || project;

    const res = await api.get(
        `/${targetProject}/_apis/wit/workitems/${id}`,
        {
            params: {
                fields: DEFAULT_FIELDS.join(","),
                "api-version": "7.1"
            }
        }
    );

    return res.data;
}

async function runWIQL(query, projectOverride, limit = 100) {

    let targetProject = project;
    let actualLimit = limit;

    if (typeof projectOverride === "number") {
        actualLimit = projectOverride;
    } else if (projectOverride) {
        targetProject = projectOverride;
    }

    const res = await api.post(
        `/${targetProject}/_apis/wit/wiql?api-version=7.1`,
        { query }
    );

    const ids = (res.data.workItems || [])
        .slice(0, actualLimit)
        .map(w => w.id);

    console.error(`Found ${ids.length} work items in project ${targetProject}`);

    if (ids.length === 0) {
        return [];
    }

    return getWorkItemsByIds(ids);
}

module.exports = {
    runWIQL,
    getWorkItemsByIds,
    getWorkItem,
    getWorkItemWithProject
};
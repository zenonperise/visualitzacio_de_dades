export interface IssueInput {
    issueType: string,
    project: string,
    projectType: string,
    key: string,
    title: string,
    sprints: string[]
    timeSpent: number,
    originalEstimate: number
}

export type IssueInputList = IssueInput[]
import { createAction, props } from "@ngrx/store";
import { IssueInputList } from "./types";

export const load = createAction('load data')
export const loaded_success = createAction('loaded data success', props<{data: IssueInputList}>())
export const loaded_failed = createAction('loaded data error', props<any>())

export const set_sprint_selection = createAction('set sprint selection', props<{ini:string, end:string}>())
export const reset_sprint_selection = createAction('reset sprint selection')

export const toggle_filter = createAction('toggle filter', props<{filter: {type: 'project'|'projectType', item: string}}>())
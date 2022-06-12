import { state } from "@angular/animations";
import { createReducer, on } from "@ngrx/store";
import { load, loaded_failed, loaded_success, reset_sprint_selection, set_sprint_selection, toggle_filter} from "./actions";
import { IssueInputList } from "./types";

export const key = 'data'

export interface State {
    issues: IssueInputList,
    loaded: boolean,
    selectedSprint?: {ini: string, end: string},
    navigationbar: boolean,
    filter: {
        projectType: {[key:string]: boolean},
        project: {[key:string]: boolean}
    }
}

export const initialState: State = {
    issues: [],
    loaded: false,
    navigationbar: true,
    filter: {projectType: {}, project: {}}
}

export const reducer = createReducer(initialState, 
    on(load, state => ({...state, loaded:false, issues:  [], selectedSprint: undefined, filter:{project:{}, projectType:{}}})),
    on(loaded_success, (state, {data}) => ({...state, loaded: true, issues:data, selectedSprint:undefined, filter: fillFilter(data)})),
    on(loaded_failed, state => ({...state, loaded: false, filter:{project:{}, projectType:{}}})),
    on(set_sprint_selection, (state, {ini, end}) => ({...state, selectedSprint:{ini, end}})),
    on(reset_sprint_selection, state => ({...state, selectedSprint:undefined})),
    on(toggle_filter, (state, {filter})=>({...state, filter: toggleFilter(state.filter, filter)})))

const toggleFilter: (oldFilter: {
        projectType: {[key:string]: boolean},
        project: {[key:string]: boolean}
    }, newFilter: {type: 'project'|'projectType', item: string})=>{
        projectType: {[key:string]: boolean},
        project: {[key:string]: boolean}
    } = (oldFilter, newFilter) =>{
        const map = oldFilter[newFilter.type]
        const updatedMap = {...map, [newFilter.item]: !map[newFilter.item]}

       return {...oldFilter, [newFilter.type]:updatedMap}
    }

const fillFilter: (data: IssueInputList) => {
        projectType: {[key:string]: boolean},
        project: {[key:string]: boolean}
    } = (data: IssueInputList) =>{
        return {projectType: [...new Set(data.map(i=>i.projectType))].reduce((a,b)=>{
            return {...a, [b]:true}
        }, <{[key:string]:boolean}>{}), 
            project: [...new Set(data.map(i=>i.project))].reduce((a,b)=> ({...a, [b]:true}), <{[key:string]:boolean}>{})}
}
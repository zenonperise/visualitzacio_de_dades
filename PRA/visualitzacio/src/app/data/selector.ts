import { createFeatureSelector} from "@ngrx/store";
import { key, State } from "./reducer";

export const featureSelector = createFeatureSelector<State>(key)
export const dataLoadedSelector = (state: State) => state.loaded




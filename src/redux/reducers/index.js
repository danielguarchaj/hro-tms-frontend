import { combineReducers } from "redux";
import authReducer from "./auth";
import patientsReducer from "./patients";
import turnsReducer from "./turns";
import adminReducer from "./admin";

const rootReducer = combineReducers({
  auth: authReducer,
  patients: patientsReducer,
  turns: turnsReducer,
  admin: adminReducer,
});

export default rootReducer;

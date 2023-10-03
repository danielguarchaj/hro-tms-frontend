import { combineReducers } from "redux";
import authReducer from "./auth";
import patientsReducer from "./patients";
import turnsReducer from "./turns";
import adminReducer from "./admin";
import appointmentsReducer from "./appointments";

const rootReducer = combineReducers({
  auth: authReducer,
  patients: patientsReducer,
  turns: turnsReducer,
  admin: adminReducer,
  appointments: appointmentsReducer,
});

export default rootReducer;

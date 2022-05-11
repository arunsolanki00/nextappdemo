import { createStore, applyMiddleware } from "redux";
import { persistStore } from "redux-persist";
import rootReducer from "./root-reducer";
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from "redux-logger";

const loggerMiddleware = createLogger()

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware)));

export const persistor = persistStore(store);
export default { store, persistor };
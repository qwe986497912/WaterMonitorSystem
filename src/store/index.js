/*
 * @Descripttion:
 * @version:
 * @Author: 唐帆
 * @Date: 2020-04-30 10:12:20
 * @LastEditors: 唐帆
 * @LastEditTime: 2020-04-30 10:15:46
 */

import {
	createStore,
	compose,
	applyMiddleware,
} from "redux";
import reducer from './reducer';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
	applyMiddleware(thunk)
));

export default store;

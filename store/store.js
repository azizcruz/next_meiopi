import { createStore, persist } from "easy-peasy";
import actions from "./actions";
import models from "./models";

const store = createStore(persist({ ...models, ...actions }));

export default store;

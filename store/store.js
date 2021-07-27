import { createStore } from "easy-peasy";
import actions from "./actions";
import models from "./models";

const store = createStore({
  ...models,
  ...actions,
});

export default store;

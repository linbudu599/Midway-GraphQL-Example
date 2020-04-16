import DataLoader from "dataloader";

export default class UserConnector {
  ctx: any;
  loader: any;
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  fetch(ids) {
    return {
      name: "Penumbra",
      age: 12,
    };
  }

  fetchByIds(ids) {
    return this.loader.loadMany(ids);
  }

  fetchById(id) {
    return this.loader.load(id);
  }
}

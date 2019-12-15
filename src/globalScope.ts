class GlobalScope {
  private _socket
  private _app


  public set socket(val:any) {
    this._socket = val
  }

  public get socket() {
    return this._socket
  }

  public set app(val:any) {
    this._app = val
  }

  public get app() {
    return this._app
  }
}

export default new GlobalScope()
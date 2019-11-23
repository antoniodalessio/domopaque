class BaseController {
  
  private _value: any
  private _name: string
  private _mainName: string
  private _data: any
  private _timestamp: number
  private _type: string
  
  
  set value(val) {
    this._value = val;
  }

  get value() {
      return this._value
  }

  set name(val) {
    this._name = val;
  }

  get name() {
      return this._name
  }

  set mainName(val) {
    this._mainName = val;
  }

  get mainName() {
      return this._mainName
  }

  get data() {
    return this._data
  }

  set data(val) {
    this._data = val
  }

  get type() {
    return this._type
  }

  set type(value) {
    this._type = value
  }

  get timestamp() {
    return this._timestamp
  }

  set timestamp(val) {
    this._timestamp = val
  }
}

export default BaseController
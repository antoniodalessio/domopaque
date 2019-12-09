/* 
  --------------------------------------------------------------------
  Actuators, sensors and virtual actuators extends this abstract class
  --------------------------------------------------------------------
*/

abstract class AbstractController {
  
  private _value: any
  private _name: string
  private _mainName: string
  private _data: any
  private _timestamp: number
  private _type: string

  set value(val: any) {
    this._value = val;
  }

  get value(): any {
      return this._value
  }

  set name(val: string) {
    this._name = val;
  }

  get name(): string{
      return this._name
  }

  set mainName(val: string) {
    this._mainName = val;
  }

  get mainName(): string {
      return this._mainName
  }

  get data(): any {
    return this._data
  }

  set data(val: any) {
    this._data = val
  }

  get type(): string{
    return this._type
  }

  set type(value: string) {
    this._type = value
  }

  get timestamp(): number {
    return this._timestamp
  }

  set timestamp(val: number) {
    this._timestamp = val
  }
}

export default AbstractController
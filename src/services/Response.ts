class Response {
  public status: boolean
  public message: any
  public errors: any
  public data: any

  constructor () {
    this.status = true
    this.message = null
    this.errors = null
    this.data = null
  }

  public setStatus (status: boolean) {
    this.status = status
  }

  public setMessage (message: string) {
    this.message = message
  }

  public setErrors (errors: any) {
    this.errors = errors
  }

  public setData (data: any) {
    this.data = data
  }
}

export default Response

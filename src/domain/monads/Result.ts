type ErrorResolvable = Error | string

type Result<T, TError extends ErrorResolvable> = Ok<T> | Err<TError>

enum ResultType {
  OK,
  ERROR
}

type Ok<T> = {
  __type: ResultType.OK
  unwrap(): T
  or<TOther>(other: TOther): T
  value(): T
}

type Err<TError extends ErrorResolvable> = {
  __type: ResultType.ERROR
  unwrap(): never
  or<TOther>(other: TOther): TOther
  value(): TError
}

function ok(): Ok<void>
function ok<T>(data: T): Ok<T>
function ok<T>(data?: T): Ok<T | void> {
  return {
    __type: ResultType.OK,
    unwrap: () => data,
    or: (_other) => data,
    value: () => data
  }
}

function err<TError extends ErrorResolvable>(err: TError): Err<TError> {
  return {
    __type: ResultType.ERROR,
    unwrap: () => {
      if (typeof err === 'string') throw new Error(err)
      throw err
    },
    or: (other) => other,
    value: () => err,
  }
}

function isOk<T, TError extends ErrorResolvable>(r: Result<T, TError>): r is Ok<T> {
  return r.__type === ResultType.OK
}

function isErr<T, TError extends ErrorResolvable>(r: Result<T, TError>): r is Err<TError> {
  return r.__type === ResultType.ERROR
}

export default Result
export { Ok, ok, isOk, Err, err, isErr }

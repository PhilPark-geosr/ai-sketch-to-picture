import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StoreState } from '../store'
import { counterActions } from '../store'
export default function Counter() {
  const dispatch = useDispatch()
  const counter = useSelector((state: any) => state.counter.counter)
  const show = useSelector((state: any) => state.counter.showCounter)
  const incrementHandler = () => {
    dispatch(counterActions.increment())
  }

  const increaseHandler = () => {
    dispatch(
      counterActions.increase({
        amount: 5
      })
    )
  }

  const decrementHandler = () => {
    dispatch(counterActions.decrement())
  }
  const toggleHandler = () => {
    dispatch(counterActions.toggleCounter())
  }
  return (
    <div>
      {show && <p className="bg-blue-300">{counter}</p>}
      <button
        className="bg-red-300 border-4 border-indigo-600"
        onClick={incrementHandler}>
        Increase
      </button>

      <button
        className="bg-blue-300 border-4 border-indigo-600"
        onClick={increaseHandler}>
        Increase
      </button>

      <button
        className="bg-red-300 border-4 border-indigo-600"
        onClick={decrementHandler}>
        Decrease
      </button>

      <button
        className="bg-red-300 border-4 border-indigo-600"
        onClick={toggleHandler}>
        Toogle
      </button>
    </div>
  )
}

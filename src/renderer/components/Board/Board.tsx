/* eslint-disable no-use-before-define */
import React from 'react'
import { v4 } from 'uuid'

import { ButtonAddBrowser } from '../ButtonAddBrowser'
import { Browser } from '../Browser'
import { setBoards } from '../../store/reducers/Addaps'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export const Board: React.FC = () => {
  const dispatch = useAppDispatch()
  const { boards, activeBoard } = useAppSelector(state => state.addaps)
  const board = boards.find(b => b.id === activeBoard)

  const addBrowser = () => {
    const newBrowser = {
      id: v4(),
      url: 'https://www.google.fr',
      top: 120,
      left: 120,
    }

    const newBrowsers = [...board.browsers, newBrowser]
    const newBoard = { ...board, browsers: newBrowsers }
    const boardIndex = boards.findIndex(b => b.id === activeBoard)
    const newBoards = [...boards]
    newBoards[boardIndex] = newBoard
    dispatch(setBoards(newBoards))
  }

  return (
    <>
      <ButtonAddBrowser onClick={addBrowser} />
      {board?.browsers.map((b, i) => {
        return (
          <Browser url={b.url} top={b.top} left={b.left} key={b.id} id={b.id} />
        )
      })}
    </>
  )
}

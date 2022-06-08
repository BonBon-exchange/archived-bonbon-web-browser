/* eslint-disable no-use-before-define */
import React, { useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import WebView from '@tianhuil/react-electron-webview'

import { BrowserTopBar } from '../BrowserTopBar'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setBoards } from '../../store/reducers/Addaps'

import { BrowserProps } from './Types'

import './style.css'

export const Browser: React.FC<BrowserProps> = ({ id, url, top, left }) => {
  const container = useRef(null)
  const dispatch = useAppDispatch()
  const { boards, activeBoard } = useAppSelector(state => state.addaps)

  const updateBoard = (bds, ab, top, left) => {
    const newBoards = [...bds]
    const boardIndex = bds.findIndex(b => b.id === ab)
    const newBoard = { ...newBoards[boardIndex] }
    const newBrowserIndex = newBoard.browsers.findIndex(b => b.id === id)
    const newBrowsers = [...newBoard.browsers]
    const newBrowser = { ...newBrowsers[newBrowserIndex] }
    newBrowser.top = top
    newBrowser.left = left
    newBrowsers[newBrowserIndex] = newBrowser
    newBoard.browsers = newBrowsers
    newBoards[boardIndex] = newBoard
    dispatch(setBoards(newBoards))
  }

  const getOffset = el => {
    const rect = el.getBoundingClientRect()
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    }
  }

  const onDragStart = () => {
    const webviews = document.querySelectorAll('.Browser__webview-container')
    webviews.forEach(webview => {
      webview.style['pointer-events'] = 'none'
    })
  }

  const onDragStop = (e, data) => {
    updateBoard(
      boards,
      activeBoard,
      getOffset(e.target).top,
      getOffset(e.target).left
    )
    const webviews = document.querySelectorAll('.Browser__webview-container')
    webviews.forEach(webview => {
      webview.style['pointer-events'] = 'auto'
    })
  }

  // useEffect(() => {
  //   // @ts-ignore
  //   webview.current.innerHTML = `<webview src="${url}"></webview>`
  // }, [])

  useEffect(() => {
    if (top) {
      // @ts-ignore
      container.current.style.top = `${top}px`
    }

    if (left) {
      // @ts-ignore
      container.current.style.left = `${left}px`
    }
  }, [])

  return (
    <Draggable
      handle=".BrowserTopBar__container"
      onStart={onDragStart}
      onStop={onDragStop}
    >
      <div className="Browser__container" ref={container}>
        <BrowserTopBar />
        <div className="Browser__webview-container">
          <WebView src={url} />
        </div>
        <div className="Browser__bottom-bar"></div>
      </div>
    </Draggable>
  )
}

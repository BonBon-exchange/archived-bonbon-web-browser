/* eslint-disable no-use-before-define */
import React from 'react'

import { TopBar } from '../TopBar'
import { Board } from '../Board'

import { AddapsProps } from './Types'

import './style.css'

export const Addaps: React.FC<AddapsProps> = () => {
  return (
    <>
      <TopBar />
      <Board />
    </>
  )
}

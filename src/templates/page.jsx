// 动态写入 Modules
// const Modules = [{ Component: window['${module.library}'], id: '${module.id}' }`)]
/* eslint-disable */ 
import ReactDOM from 'react-dom'
import React, { useEffect, useState } from 'react'

import _ from 'lodash';
import { PageHeader, PageFooter } from '@base';

const initialContent = JSON.parse(document.getElementById('initialContent').innerHTML)

const App = () => {
  const [content, setContent] = useState(initialContent)
  useEffect(() => {
    const JSON_PATH = window.JSON_PATH
    
    setContent(initialContent)
    // 有 json 数据，调用接口获取
    if (JSON_PATH) {
      (async () => {
        const res = await fetch(JSON_PATH)
        const json = await res.json()
        if (json.code === 0) {
          const pairs = json.data.content.map(item => [item.moudleID, item.moduleData])
          setContent(_.fromPairs(pairs))
        }
      })()
    }
  }, [])

  return (
    <div>
      <PageHeader />
      {
        Modules.map(module => {
          const { Component, id } = module
          const data = content[id]
          return (module && data) ? <Component.default key={id} data={data} /> : null
        })
      }
      <PageFooter />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

import { defineCustomElement } from 'vue'
import MyWidget from './components/App/index.vue'

const MyWidgetElement = defineCustomElement(MyWidget)

// 注册为浏览器原生自定义元素
customElements.define('video-roll-panel', MyWidgetElement)

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(
    document.createElement('video-roll-panel')
  )
})
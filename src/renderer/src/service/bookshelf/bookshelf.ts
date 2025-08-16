import { req } from '../../api/axios'

// API接口类型定义

export interface BookInfoBean {
  bookUrl: 'https://i.12bz.net/4_4774/'
  tocUrl: 'https://i.12bz.net/html/4/4774/index.html'
  origin: 'https://i.12bz.net'
  originName: '🪐第一版主'
  name: '极品家丁之淫乱后宫'
  author: '午夜人屠'
  kind: '类型：高辣,更新时间：2019-11-20 17:29'
  coverUrl: '/assets/default/covers/0c71029be65e8865ea285a1740f721e8.jpg'
  intro: '　　　　本书简介： 抱歉，工作忙暸很久，修订版的已经全弄好暸，这新的一章奉上，希望大家多多包涵！！\n　　还是以前那句话，这部同人不搞，女主只是爲暸满足自己的而出轨，而不是被人的，如果想看的话，那就抱歉暸。\n　　'
  type: 0
  group: 1
  latestChapterTitle: '【同人】极品家丁之淫乱后宫（十三）'
  latestChapterTime: 1724335395731
  lastCheckTime: 1719413364633
  lastCheckCount: 0
  totalChapterNum: 13
  durChapterTitle: '【同人】极品家丁之淫乱后宫（一）'
  durChapterIndex: 0
  durChapterPos: 0
  durChapterTime: 1724334913025
  canUpdate: true
  order: 0
  originOrder: 0
  useReplaceRule: true
  isInShelf: true
}

// 获取书架数据
export async function getBookshelf(refresh: number = 0): Promise<BookInfoBean[] | null> {
  try {
    const params = {
      refresh: refresh,
      v: Date.now()
    }
    return await req.get<BookInfoBean[]>('/getBookshelf', { params })
  } catch (error) {
    console.error('获取书架数据失败:', error)
    throw error
  }
}

// 保存书架数据到本地（如果需要）
export async function saveBookshelfToLocal(data: BookInfoBean[]): Promise<void> {
  try {
    localStorage.setItem('bookshelf_data', JSON.stringify(data))
  } catch (error) {
    console.error('保存书架数据到本地失败:', error)
  }
}

// 从本地获取书架数据
export function getBookshelfFromLocal(): BookInfoBean[] | null {
  try {
    const data = localStorage.getItem('bookshelf_data')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('从本地获取书架数据失败:', error)
    return null
  }
}

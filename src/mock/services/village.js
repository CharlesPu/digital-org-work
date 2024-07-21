import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 201

const villageList = (options) => {
  const parameters = getQueryParameters(options)
  console.log('mock get request parameters:', options, parameters)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      // id: tmpKey,
      town_name: '新塘街道',
      village_name: '新丰村',
      description: '这是一段描述',
      callNo: Mock.mock('@integer(1, 999)'),
      status: Mock.mock('@integer(0, 3)'),
      updatedAt: Mock.mock('@datetime'),
      editable: false
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

Mock.mock(/\/village\/list/, 'get', villageList)
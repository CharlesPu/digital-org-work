import request from '@/utils/request'

const villageApi = {
  List: '/village/list'
}

export default villageApi

export function getVillageList (parameter) {
  return request({
    url: villageApi.List,
    method: 'get',
    params: parameter
  })
}

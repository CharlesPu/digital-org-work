<template>
  <div>
    <!-- <page-header-wrapper
    title=""
    breadcrumb="false"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
    /> -->
    <a-tabs default-active-key="VillageList" size="small" @change="handleTabChange" :tab-bar-style="{marginBottom: '6px', paddingLeft: '6px'}">
      <a-tab-pane key="VillageList" tab="村社维度"><ListByVillage/></a-tab-pane>
      <a-tab-pane key="TownList" tab="镇街维度" force-render><ListByTown/></a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ListByVillage from './ListByVillage'
import ListByTown from './ListByTown'

export default {
  name: 'List',
  components: {
    ListByVillage,
    ListByTown
  },
  data () {
    return {
      // tabList: [
      //   { key: 'byVillage', tab: '村社维度' },
      //   { key: 'byTown', tab: '镇街维度' }
      // ],
      // tabActiveKey: 'byVillage'
    }
  },
  methods: {
    // 标签切换
    handleTabChange (key) {
      console.log(key)
      this.tabActiveKey = key
    }
  }
}
</script>

<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回"
      sub-title="This is a subtitle"
      @back="() => $router.go(-1)"
    />
    <a-card :bordered="false">
      <a-descriptions title="退款申请">
        <a-descriptions-item label="取货单号">1000000000</a-descriptions-item>
        <a-descriptions-item label="状态">已取货</a-descriptions-item>
        <a-descriptions-item label="销售单号">1234123421</a-descriptions-item>
        <a-descriptions-item label="子订单">3214321432</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <a-descriptions title="用户信息">
        <a-descriptions-item label="用户姓名">付小小</a-descriptions-item>
        <a-descriptions-item label="联系电话">18100000000</a-descriptions-item>
        <a-descriptions-item label="常用快递">菜鸟仓储</a-descriptions-item>
        <a-descriptions-item label="取货地址">浙江省杭州市西湖区万塘路18号</a-descriptions-item>
        <a-descriptions-item label="备注">	无</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <div class="title">退货商品</div>
      <s-table
        style="margin-bottom: 24px"
        row-key="id"
        :columns="goodsColumns"
        :data="loadGoodsData">
      </s-table>
      <div class="title">退货进度</div>
      <s-table
        style="margin-bottom: 24px"
        row-key="key"
        :columns="scheduleColumns"
        :data="loadScheduleData">
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status" :text="status | statusFilter"/>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
// import { STable } from '@/components'

export default {
  data () {
    return {
      size: 'default',
      villageMeta: ''
    }
  },
  methods: {
    onChange (e) {
      console.log('size checked', e.target.value)
      this.size = e.target.value
    }
  },
  mounted: function () {
    // console.log(this.$route.params.villageMeta)
    this.villageMeta = this.$route.params.villageMeta
  }
}
</script>

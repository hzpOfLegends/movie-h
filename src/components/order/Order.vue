<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="订单编号" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="queryInfo.status"
            placeholder="是否发货"
            @change="getOrderList"
          >
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="queryInfo.is_send"
            placeholder="是否发货"
            @change="getOrderList"
          >
            <el-option
              v-for="item in is_send_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="queryInfo.is_finish"
            placeholder="是否发货"
            @change="getOrderList"
          >
            <el-option
              v-for="item in is_finish_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <div v-html="props.row.goods_name"></div>
              </el-form-item>
              <el-form-item label="发货地址">
                <span>{{ props.row.consignee_addr }}</span>
              </el-form-item>
              <el-form-item label="商品总价">
                <span>{{ props.row.order_price }}</span>
              </el-form-item>
              <el-form-item label="订单编号">
                <span>{{ props.row.order_number }}</span>
              </el-form-item>
              <!-- <el-form-item label="商品分类">
                <span>{{ props.row.category }}</span>
              </el-form-item> -->
              <!-- <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.desc }}</span>
              </el-form-item> -->
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="快递单号" prop="order_price">
          <template slot-scope="scope">
            {{scope.row.expressage}}
            {{scope.row.expressage_no}}
          </template>
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.status === 0 && scope.row.payChannel === 1"
              >未付款</el-tag
            >
            <el-tag type="danger" size="mini" v-if="scope.row.status === 0 && scope.row.payChannel === 2"
              >待确认付款</el-tag
            >
            <el-tag type="success" size="mini" v-else>已付款</el-tag>
            <el-tag type="warning" size="mini">{{scope.row.payChannel === 1? '余额支付': '在线支付'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单号后6位">
          <template slot-scope="scope">
            {{scope.row.payChannel === 2? scope.row.online_number: '-'}}
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.is_send === 0"
              >未发货</el-tag
            >
            <el-tag type="success" size="mini" v-else>已发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单是否完成" prop="is_send">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.is_finish === 0"
              >未完成</el-tag
            >
            <el-tag type="success" size="mini" v-else>已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createdAt"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改地址" placement="top-start">
              <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.order_number)"
            ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="填写发货地址自动改写状态为已发货" placement="top-start">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-check"
                @click="showOrderNumDialog(scope.row.order_number)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="在线支付确认收款" placement="top-start" v-if="scope.row.payChannel === 2">
              <el-button
                size="mini"
                icon="el-icon-s-help"
                @click="confirmOnline(scope.row.order_number)"
              ></el-button>
            </el-tooltip>
            <!-- <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showProgressDialog"
            ></el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="orderNumDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="orderForm"
        :rules="orderFormRules"
        ref="orderFormRef"
        label-width="100px"
      >
        <el-form-item label="快递公司" prop="expressage">
          <el-input v-model="orderForm.expressage"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressage_no">
          <el-input v-model="orderForm.expressage_no"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderNumDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrder(2)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrder(1)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度对话框 -->
    <el-dialog
      title="查看物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
          >{{ activity.context }}</el-timeline-item
        >
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";

export default {
  data() {
    return {
      // 订单列表查询参数
      queryInfo: {
        query: "",
        status: null,
        is_send: null,
        is_finish: null,
        pageNum: 1,
        pageSize: 10
      },
      statusList: [
        { id: null, name: "是否付款" },
        { id: 0, name: "未付款" },
        { id: 1, name: "已付款" }
      ],
      is_send_list: [
        { id: null, name: "是否发货" },
        { id: 1, name: "已发货" },
        { id: 0, name: "未发货" }
      ],
      is_finish_list: [
        { id: null, name: "是否完成" },
        { id: 1, name: "已完成" },
        { id: 0, name: "未完成" }
      ],
      total: 0,
      // 订单列表
      orderList: [],
      // 修改地址对话框
      addressDialogVisible: false,
      // 修改单号对话框
      orderNumDialogVisible: false,
      orderForm: {
        expressage: null,
        expressage_no: null
      },
      orderFormRules: {
        expressage: [
          { required: true, message: "请选择快递公司", trigger: "blur" }
        ],
        expressage_no: [
          { required: true, message: "请输入订单号", trigger: "blur" }
        ]
      },
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      cityData,
      // 物流进度对话框
      progressDialogVisible: false,
      // 物流进度
      progressInfo: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async confirmOnline(order_number) {
      const { data: res } = await this.$http.post("online/paypout", {order_number});
      if (res.status !== 200) {
        return this.$message.error("获取订单列表失败！");
      }
      this.getOrderList();
    },
    showOrderNumDialog(order_number) {
      this.orderNumDialogVisible = true;
      this.order_number = order_number;
    },
    async editOrder(val) {
      let params = {
        consignee_addr:
          val === 1
            ? `${this.addressForm.address1[0]}${this.addressForm.address1[1]}${
                this.addressForm.address1[2] ? this.addressForm.address1[2] : ""
              }${this.addressForm.address2}`
            : null,
        order_number: this.order_number,
        expressage: val === 2 ? this.orderForm.expressage : null,
        expressage_no: val === 2 ? this.orderForm.expressage_no : null
      };
      const { data: res } = await this.$http.post("order/edit", params);
      if (res.status !== 200) {
        return this.$message.error("获取订单列表失败！");
      }
      this.orderForm.expressage = null;
      this.orderForm.expressage_no = null;
      this.getOrderList()
      this.orderNumDialogVisible = false;
    },
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取订单列表失败！");
      }
      this.total = res.data.total;
      this.orderList = res.data.list;
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pageNum = newSize;
      this.getOrderList();
    },
    showEditDialog(order_number) {
      this.addressDialogVisible = true;
      this.order_number = order_number;
    },
    orderDialogClosed() {
      this.$refs.orderFormRef.resetFields();
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProgressDialog() {
      // 供测试的物流单号：1106975712662
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流进度失败!");
      }
      this.progressInfo = res.data;
      this.progressDialogVisible = true;
    }
  }
};
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>交易流水</el-breadcrumb-item>
      <el-breadcrumb-item>交易记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select
            v-model="status"
            placeholder="订单状态"
            @change="getRolesList"
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
      </el-row>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-tabs v-model="activeName" @tab-click="getRolesList">
            <el-tab-pane label="充值记录" name="first">
              <el-button @click="payDialogVisible = true">更新支付二维码</el-button>
              <el-button @click="payDialogVisible2 = true">更新支付银行卡</el-button>
              <el-table :data="topuplist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                  prop="rechargeOrderNo"
                  label="订单号"
                ></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="payChannel" label="充值方式">
                  <template slot-scope="scope">
                    {{ scope.row.payChannel === 1 ? "银行卡" : "支付宝" }}
                    :
                    {{
                      scope.row.payChannel === 1
                        ? `${scope.row.name} - ${scope.row.bank} - ${scope.row.bankNum}`
                        : scope.row.payNum
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rechargeAmount"
                  label="金额"
                ></el-table-column>
                <el-table-column
                  prop="createdAt"
                  label="时间"
                ></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{
                      scope.row.status === 1
                        ? "已完成"
                        : scope.row.status === 0
                        ? "未完成"
                        : "已取消"
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      v-show="scope.row.status === 0"
                      type="primary"
                      icon="el-icon-check"
                      size="mini"
                      circle
                      @click="topup(1, scope.row.rechargeOrderNo,)"
                    ></el-button>
                    <el-button
                      v-show="scope.row.status === 0"
                      type="danger"
                      icon="el-icon-close"
                      size="mini"
                      circle
                      @click="topup(2, scope.row.rechargeOrderNo,)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="提现记录" name="second">
              <el-table :data="withdrawlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                  prop="rechargeOrderNo"
                  label="订单号"
                ></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column
                  prop="rechargeAmount"
                  label="金额"
                ></el-table-column>
                <el-table-column
                  prop="createdAt"
                  label="时间"
                ></el-table-column>
                <!-- <el-table-column
                  prop="createdAt"
                  label="银行信息"
                >
                  <template slot-scope="scope">
                    {{}}
                  </template>
                </el-table-column> -->
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{
                      scope.row.status === 1
                        ? "已完成"
                        : scope.row.status === 0
                        ? "未完成"
                        : "已取消"
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      v-show="scope.row.status === 0"
                      type="primary"
                      icon="el-icon-check"
                      size="mini"
                      circle
                      @click="withdraw(1, scope.row.rechargeOrderNo)"
                    ></el-button>
                    <el-button
                      v-show="scope.row.status === 0"
                      type="danger"
                      icon="el-icon-close"
                      size="mini"
                      circle
                      @click="withdraw(2, scope.row.rechargeOrderNo)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="佣金提现记录" name="third">
              <el-table :data="agencylist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                  prop="rechargeOrderNo"
                  label="订单号"
                ></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column
                  prop="rechargeAmount"
                  label="金额"
                ></el-table-column>
                <el-table-column
                  prop="createdAt"
                  label="时间"
                ></el-table-column>
                <!-- <el-table-column
                  prop="createdAt"
                  label="银行信息"
                >
                  <template slot-scope="scope">
                    {{}}
                  </template>
                </el-table-column> -->
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{
                      scope.row.status === 1
                        ? "已完成"
                        : scope.row.status === 0
                        ? "未完成"
                        : "已取消"
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      v-show="scope.row.status === 0"
                      type="primary"
                      icon="el-icon-check"
                      size="mini"
                      circle
                      @click="withagency(1, scope.row.rechargeOrderNo, scope.row.user_id)"
                    ></el-button>
                    <el-button
                      v-show="scope.row.status === 0"
                      type="danger"
                      icon="el-icon-close"
                      size="mini"
                      circle
                      @click="withagency(2, scope.row.rechargeOrderNo, scope.row.user_id)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="支付二维码" :visible.sync="payDialogVisible" width="40%">
      <el-upload
        :action="actionUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :headers="headerObj"
        :limit="100"
        list-type="picture"
        :on-success="handleSuccess"
      >
        <el-button size="small" type="primary">更换图片</el-button>
      </el-upload>
      <div>
        <img :src="payimg" style="width: 200px;margin: 30px;" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 编辑银行卡 -->
    <el-dialog title="银行卡" :visible.sync="payDialogVisible2" width="30%">
      <el-form
        :model="dataFrom"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="银行名字">
          <el-input v-model="dataFrom.bank"></el-input>
        </el-form-item>
        <el-form-item label="持卡人名字">
          <el-input v-model="dataFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="dataFrom.bankNum" type="number"></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateBank">修 改</el-button>
        <el-button @click="payDialogVisible2 = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="40%"
      @close="addRoleDialogClosed"
    >
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      status: null,
      statusList: [
        { id: 2, name: "已取消" },
        { id: 1, name: "已完成" },
        { id: 0, name: "未完成" }
      ],
      payChannel: null,
      actionUrl: "",
      dataFrom: {
        bank: null,
        name: null,
        bankNum: null
      },
      headerObj: {
        authorization: localStorage.getItem('authorization')
      },
      payChannelList: [
        { id: 2, name: "支付宝" },
        { id: 3, name: "微信" }
      ],
      payimg: "",
      payDialogVisible: false,
      payDialogVisible2: false,
      topuplist: [],
      withdrawlist: [],
      agencylist: [],
      activeName: "first",
      // 所有角色列表
      rolesList: [],
      // 分配权限框
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      //  树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //   默认选中节点ID值
      defKeys: [],
      //   添加用户对话框
      AddRoleDialogVisible: false,
      // 添加角色表单
      addRoleForm: {},
      //   添加角色表单验证
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      //   编辑角色信息
      editRoleForm: {},
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      //   当前即将分配权限的Id
      roleId: 0
    };
  },
  created() {
    this.getRolesList();
    this.getPayImg();
    this.getPayBank();
    this.actionUrl = `${axios.defaults.baseURL}upload/payimg`;
  },
  methods: {
    async getPayBank() {
      const { data: res } = await this.$http.get("topup/bank");
      this.dataFrom = res.data
    },
    async updateBank() {
      const { data: res } = await this.$http.post("update/bank", { bank: this.dataFrom.bank, name: this.dataFrom.name, bankNum: this.dataFrom.bankNum });
      if (res.status !== 200) {
        return this.$message.error("操作失败");
      }
      this.payDialogVisible2 = false
    },
    handleSuccess (response) {
      this.getPayImg()
    },
    async setPayimg() {},
    async getPayImg() {
      const { data: res } = await this.$http.get("payimg");
      this.payimg = `${axios.defaults.baseURL}${res.data.img}`;
    },
    async withdraw(val, rechargeOrderNo) {
      const { data: res } = await this.$http.post(
        "finance/withdraw/operation",
        { rechargeOrderNo, status: val }
      );
      if (res.status !== 200) {
        return this.$message.error("操作失败");
      }
      this.getRolesList();
    },
    async topup(val, rechargeOrderNo) {
      const { data: res } = await this.$http.post(
        "finance/recharge/operation",
        { rechargeOrderNo, status: val }
      );
      if (res.status !== 200) {
        return this.$message.error("操作失败");
      }
      this.getRolesList();
    },
    async withagency(val, rechargeOrderNo, user_id) {
      const { data: res } = await this.$http.post(
        "withdraw/agency/record/operation",
        { rechargeOrderNo, status: val, user_id }
      );
      if (res.status !== 200) {
        return this.$message.error("操作失败");
      }
      this.getRolesList();
    },
    async getRolesList() {
      if (this.activeName === "first") {
        const { data: res } = await this.$http.get("finance/recharge/record", {
          params: {
            status: this.status
          }
        });
        if (res.status !== 200) {
          return this.$message.error("获取充值记录失败！");
        }
        this.topuplist = res.data.data;
      } else if(this.activeName === 'second'){
        const { data: res } = await this.$http.get("finance/withdraw/record", {
          params: {
            status: this.status
          }
        });
        if (res.status !== 200) {
          return this.$message.error("获取提现记录失败！");
        }
        this.withdrawlist = res.data.data;
      }else if(this.activeName === "third") {
        const { data: res } = await this.$http.get("withdraw/agency/record/page", {
          params: {
            status: this.status
          }
        });
        if (res.status !== 200) {
          return this.$message.error("获取佣金提现记录失败！");
        }
        this.agencylist = res.data.data;
      }
    },
    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示 删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== "confirm") {
        this.$message.info("已取消权限删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      this.rolesList = res.data;
      //   不建议使用
      this.getRolesList();
    },
    // 分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取角色的所有权限
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }
      //   获取权限树
      this.rightsList = res.data;
      //   console.log(res)
      //   递归获取三级节点的id
      this.getLeafkeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys(node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafkeys(item, arr));
    },
    // 权限对话框关闭事件
    setRightDialogClosed() {
      this.rightsList = [];
    },
    // 添加角色对话框的关闭
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 添加角色
    addRoles() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败！");
        }
        this.$message.success("添加角色成功！");
        this.AddRoleDialogVisible = false;
        this.getRolesList();
      });
    },
    // 删除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除角色失败！");
      this.$message.success("删除用户成功！");
      this.getRolesList();
    },
    // 编辑角色
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("查询角色信息失败！");
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
    },
    editRoles() {
      this.$refs.editRoleFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("更新角色信息失败！");
        }
        // 隐藏编辑角色对话框
        this.editRoleDialogVisible = false;
        this.$message.success("更新角色信息成功！");
        this.getRolesList();
      });
    },
    // 分配权限
    async allotRights(roleId) {
      // 获得当前选中和半选中的Id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功!");
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  }
};
</script>
<style>
  .el-upload-list {
  display: none !important;
}
</style>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">设置代理分成</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" ref="topicTable" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="expand">
          <template slot>
            <el-table :data="promoterList" border stripe>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="username" label="账号"></el-table-column>
              <el-table-column
                prop="total_commission"
                label="累计收益"
              ></el-table-column>
              <el-table-column
                prop="total_orders"
                label="累计订单数"
              ></el-table-column>
              <el-table-column
                prop="commission"
                label="可派发佣金"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="payout(scope.row.user_id)"
                    >派发</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="register_code" label="姓名"></el-table-column>
        <el-table-column prop="user_email" label="邮箱"></el-table-column>
        <el-table-column prop="balance" label="下线">
          <template slot-scope="scope">
            {{ scope.row.sp_promoters.length }}
          </template>
        </el-table-column>
        <el-table-column prop="register_code" label="邀请码"></el-table-column>
        <el-table-column prop="register_code" label="银行卡">
          <template slot-scope="scope">
            {{ scope.row.bank }} -
            {{ scope.row.bankNum }}
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="支付宝"></el-table-column>
        <el-table-column prop="role_name" label="会员等级"></el-table-column>

        <el-table-column prop="register_code" label="查看">
          <template slot-scope="scope">
            <span
              @click="lookPromoter(scope.row)"
              style="color: blue; cursor:pointer;"
              >查看下线</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="showEditDialog(scope.row.user_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
      ></el-pagination> -->
    </el-card>

    <!-- 设置代理 -->
    <el-dialog
      title="设置代理"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <p>一级代理={{level.first_level}}</p>
      <!-- 内容主体 -->
      <el-form
        :model="addUserForm"
        ref="addUserFormRef"
        :rules="addUserFormRules"
        label-width="100px"
      >
        <el-form-item label="一级代理" prop="username">
          <el-input v-model="addUserForm.username" placeholder="0.01 = 1%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editUserForm"
        ref="editUserFormRef"
        :rules="editUserFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="editUserForm.user_email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="user_tel">
          <el-input v-model="editUserForm.user_tel"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      // 返回一个错误提示
      callback(new Error("请输入合法的手机号码"));
    };
    return {
      // 获取用户列表查询参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 5
      },
      promoterList: [],
      userlist: [],
      totle: 0,
      // 添加用户对话框
      addDialogVisible: false,
      // 用户添加
      addUserForm: {
        username: "",
        password: "",
        user_email: "",
        user_tel: ""
      },
      // 用户添加表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入一级代理", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入二级代理", trigger: "blur" },
        ],
      },
      // 修改用户
      editDialogVisible: false,
      editUserForm: {},
      // 编辑用户表单验证
      editUserFormRules: {
        user_email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        user_tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 分配角色对话框
      setRoleDialogVisible: false,
      // 当前需要被分配角色的用户
      userInfo: {},
      // 所有角色数据列表
      rolesLsit: [],
      level: {},
      // 已选中的角色Id值
      selectRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async payout(user_id) {
      const { data: res } = await this.$http.post("payout/pronmoter", {
        user_id
      });
      if (res.status !== 200) {
        return this.$message.error("派发失败！");
      }
      this.$message.success("派发成功！");
      this.getUserList();
    },
    lookPromoter(row) {
      this.userlist.map(item => {
        this.$refs.topicTable.toggleRowExpansion(item, false);
      });
      this.load(row).then(res => {
        this.$refs.topicTable.toggleRowExpansion(row, true);
      });
    },
    async load(row) {
      const { data: res } = await this.$http.get("info/promoter", {
        params: {
          user_id: row.user_id
        }
      });
      if (res.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.promoterList = await res.data;
    },
    async getUserList() {
      const { data: res } = await this.$http.get("info/list");
      if (res.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.list.Inform;
      this.level = res.list.level
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagenum = newSize;
      this.getUserList();
    },
    // 监听 switch开关 状态改变
    async userStateChanged(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功！");
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      // 提交请求前，表单预验证
      this.$refs.addUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return;
        let params = {
          first_level: this.addUserForm.username,
          second_level: this.addUserForm.password,
        }
        const { data: res } = await this.$http.post("agency", params);
        if (res.status !== 201) {
          this.$message.error("修改失败！");
        }
        this.$message.success("修改成功！");
        // 隐藏添加用户对话框
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 编辑用户信息
    async showEditDialog(user_id) {
      const { data: res } = await this.$http.post("user/detail", { user_id });
      if (res.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editUserForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    // 修改用户信息
    editUser() {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editUserForm.id,
          {
            user_email: this.editUserForm.user_email,
            user_tel: this.editUserForm.user_tel
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("更新用户信息失败！");
        }
        // 隐藏添加用户对话框
        this.editDialogVisible = false;
        this.$message.success("更新用户信息成功！");
        this.getUserList();
      });
    },
    // 删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败！");
      this.$message.success("删除用户成功！");
      this.getUserList();
    },
    // 展示分配角色的对话框
    async showSetRole(role) {
      this.userInfo = role;
      // 展示对话框之前，获取所有角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesLsit = res.data;
      this.setRoleDialogVisible = true;
    },
    // 分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户角色失败！");
      }
      this.$message.success("更新角色成功！");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 分配角色对话框关闭事件
    setRoleDialogClosed() {
      this.selectRoleId = "";
      this.userInfo = {};
    }
  }
};
</script>

<style lang="less" scoped></style>

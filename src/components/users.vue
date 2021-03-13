<template>

  <div id="user">
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/index' }">首頁</el-breadcrumb-item>
   <el-breadcrumb-item>帳號管理</el-breadcrumb-item>
   </el-breadcrumb>
   <h3 style="margin-top:20px;color:#696969;">帳號管理</h3>

   <div class="input-group" slot="header" style="margin-top:20px">
     <div style="margin-top:10px; margin-bottom:10px;float:right;margin-right: 37px;">
     <el-button type="primary" @click="dialogVisible=true">新增</el-button>
    </div>
    <el-label style="color:#696969; ">使用者名稱 : </el-label>
    <el-input  v-model="search1" placeholder="請輸入使用者名稱" style="width:150px;margin-right:10px"></el-input>
    <el-label style="color:#696969;">E-mail : </el-label>
    <el-input  v-model="search2" placeholder="請輸入Email" style="width:200px;margin-right:10px"> </el-input>
   <el-button slot="append" @click="query()" i-con="el-icon-search">查詢</el-button>
    </div>



  <el-table :data="tableData" style="width: 100%;margin-top:20px">
            <el-table-column prop="id" label="Id" width="80">
            </el-table-column>
            <el-table-column prop="email" label="Email" >
            </el-table-column>
            <el-table-column prop="username" label="使用者名稱" width="180">
            </el-table-column>
            <el-table-column prop="first_name" label="名字" width="180">
            </el-table-column>
            <el-table-column prop="last_name" label="姓氏" width="180">
            </el-table-column>
             <el-table-column prop="is_staff"  label="管理員" width="100" style="text-align:center">
            </el-table-column>
              <el-table-column width="150">
         <template slot-scope="scope" >
                        <!-- 修改按鈕 -->
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 刪除按鈕 -->
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
        </el-table>
        <div class="pagination" style="">
            <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 40]"
                :page-size="pagesize"
                layout="total, sizes,prev, pager, next"
                :total="tableData.length"
                prev-text="上一頁"
                next-text="下一頁">
            </el-pagination> -->
        <el-button @click="upPage">上一頁</el-button>
     <el-button @click="downPage">下一頁</el-button>
  </div>
  <!-- 新增使用者的對話方塊 -->
        <el-dialog
            title="新增使用者"
            :visible.sync="dialogVisible"
            width="50%"
            >
            <!-- 內容的主體區域 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="使用者名稱" prop="username">
          <el-input  v-model="addForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input  v-model="addForm.password" ></el-input>
        </el-form-item>

        <el-form-item label="email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
          <el-form-item label="姓氏" prop="last_name">
          <el-input v-model="addForm.last_name"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="first_name">
          <el-input v-model="addForm.first_name"></el-input>
        </el-form-item>
         <el-form-item label="是否管理員" placeholder="請選擇" prop="is_staff">
          <el-select v-model="addForm.is_staff" >
           <el-option
           v-for="item in staffList"
                :key=item.id
               :label=item.name
              :value=item.id
               ></el-option>
          </el-select>
         </el-form-item>
            </el-form>
            <!-- 底部區域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">確 定</el-button>
            </span>
        </el-dialog>
       <!-- 修改使用者的對話方塊 -->
    <el-dialog
      title="修改使用者"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="使用者名稱" prop="username">
          <el-input  v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email" >
          <el-input v-model="editForm.email" disabled></el-input>
        </el-form-item>
          <el-form-item label="姓氏" prop="last_name">
          <el-input v-model="editForm.last_name"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="first_name">
          <el-input v-model="editForm.first_name"></el-input>
        </el-form-item>
         <el-form-item label="是否管理員" placeholder="請選擇" prop="is_staff">
          <el-select v-model="editForm.is_staff" >
           <el-option
           v-for="item in staffList"
                :key=item.id
               :label=item.name
              :value=item.id
               ></el-option>
          </el-select>
         </el-form-item>
      </el-form>

      <el-form :model="editProfileForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="居住地" prop="location">
          <el-input  v-model="editProfileForm.location" ></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birth_date" >
          <el-input v-model="editProfileForm.birth_date" ></el-input>
        </el-form-item>
          <el-form-item label="電話號碼" prop="phone_number">
          <el-input v-model="editProfileForm.phone_number"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">確 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>


<script>
import axios from "axios";

const url = "/api/users";
const url_p = "/api/users?page=";
export default {
  name: "users",

  data() {
    var checkEmail = (rule, value, callback) => {
      // 驗證郵箱的正則表示式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 驗證通過，合法的郵箱
        return callback();
      }
      // 驗證不通過，不合法
      callback(new Error("請輸入合法的信箱"));
    };
    return {
      currentPage: 1, //默认显示页面为1
      pagesize: 5, //    每页的数据条数
      tableData: [],
      editDialogVisible: false,
      dialogVisible: false,
      search: "",
      editForm: [],
      idvalue: "",
      page: "",
      nxt_page: "",
      pre_page: "",
      addForm: [],
      username_: [],
      datas: [],
      search1: "",
      search2: "",
      editProfileForm: [],
      staffList: [
        {
          name: "否",
          id: "0"
        },
        {
          name: "是",
          id: "1"
        }
      ],
      addFormRules: {
        username: [
          { required: true, message: "請輸入使用者名稱", trigger: "blur" },
          {
            min: 3,
            max: 150,
            message: "長度在 3 到 150 個字元",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "請輸入密碼", trigger: "blur" },
          { min: 6, max: 10, message: "長度在 6 到 15 個字元", trigger: "blur" }
        ],
        email: [
          { required: true, message: "請輸入email", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ]
      },
      editFormRules: {
        username: [
          { required: true, message: "請輸入使用者名稱", trigger: "blur" },
          {
            min: 3,
            max: 150,
            message: "長度在 3 到 150 個字元",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "請輸入密碼", trigger: "blur" },
          { min: 6, max: 10, message: "長度在 6 到 15 個字元", trigger: "blur" }
        ],
        email: [
          { required: true, message: "請輸入email", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.page = 1;
      axios.get(`${url_p + this.page}`).then(
        response => {
          //console.log(response.data);
          this.tableData = response.data.results;
          this.nxt_page = response.data.next;
          this.pre_page = url_p + this.page;
          this.Revers_staff();
        },
        response => {
          console.log(response.error);
        }
      );
    },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pagesize = size;
      /*console.log(this.pagesize) */
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      /*console.log(this.currentPage) */
    },
    Revers_staff() {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].is_staff) this.tableData[i].is_staff = "✓";
      }
    },

    removeUserById(id) {
      if (confirm("確定要刪除嗎") == true) {
        // 發起刪除使用者資訊的資料
        const url2 = url + "/" + id; // origin api ur
        axios.delete(`${url2}`).then(
          response => {
            // this.getData()
            console.log(response);
            location.reload();
          },
          response => {
            console.log(response.error);
          }
        );
      }
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      const url1 = url + "/" + id;
      axios.get(`${url1}`).then(
        response => {
          console.log(response.data);
          this.editForm = response.data;
          if (this.editForm.is_staff == true) this.editForm.is_staff = "是";
          else this.editForm.is_staff = "否";
        },
        response => {
          console.log(response.error);
        }
      );
      this.idvalue = id;
    },
    // 點選按鈕，新增新使用者
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // 校驗失敗
        if (!valid) return;
        // 校驗成功，可以發起新增使用者的網路請求

        axios
          .post(`${url}`, {
            username: this.addForm.username,
            email: this.addForm.email,
            password: this.addForm.password,
            last_name: this.addForm.last_name,
            first_name: this.addForm.first_name,
            is_staff: this.addForm.is_staff
          })
          .then(res => {
            console.table(res.data);
            location.reload();
          })
          .catch(error => {
            console.error(error);
            if (error.response.data != "") {
              this.$message.error(
                "使用者名稱: " + error.response.data.username
              );
            }
          })
          .finally(() => {
            /* 不論失敗成功皆會執行 */
          });
        // this.$message.success('新增使用者成功！')
        // 隱藏新增使用者的對話方塊
        this.dialogVisible = false;
      });
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        // 發起修改使用者資訊的資料請求

        const url1 = url + "/" + this.idvalue;
        axios
          .put(`${url1}`, {
            username: this.editForm.username,
            email: this.editForm.email,
            first_name: this.editForm.first_name,
            last_name: this.editForm.last_name,
            is_staff: this.editForm.is_staff
          })
          .then(response => {
            console.log(response.data);
            this.idvalue = "";
            location.reload();
          })
          .catch(err => {
            console.log(err);
            if (err.response.data.email != "") alert(err.response.data.email);
          });

        // 關閉對話方塊
        this.editDialogVisible = false;
      });
    },
    upPage() {
      this.pre_page = this.pre_page.replace("https", "http");
      axios.get(`${this.pre_page}`).then(
        response => {
          //console.log(response.data);
          this.tableData = response.data.results;
          this.pre_page = response.data.previous;
          this.nxt_page = response.data.next;
          this.Revers_staff();
        },
        response => {
          console.log(response.data);
        }
      );
    },
    downPage() {
      this.nxt_page = this.nxt_page.replace("https", "http");
      axios.get(`${this.nxt_page}`).then(
        response => {
          //console.log(response.data);
          this.tableData = response.data.results;
          this.pre_page = response.data.previous;
          this.nxt_page = response.data.next;
          this.Revers_staff();
        },
        response => {
          console.log(response.data);
        }
      );
    },
    query() {
      if ((this.search1 == "") & (this.search2 == "")) {
        this.getData();
      } else {
        var params = "";
        if ((this.search1 != "") & (this.search2 == "")) {
          params = "username=" + this.search1;
        } else if ((this.search1 == "") & (this.search2 != "")) {
          params = "email=" + this.search2;
        } else {
          params = "username=" + this.search1 + "&" + "email=" + this.search2;
        }
        axios.get(`${url + "/search?" + params}`).then(
          response => {
            //console.log(response.data);
            this.tableData = response.data;
            this.nxt_page = url + "/search?" + params;
            this.pre_page = url + "/search?" + params;
            this.Revers_staff();
          },
          response => {
            console.log(response.error);
          }
        );

        // this.tableData=[]
        // for(var i=0;i<this.datas.length;i++){
        //   if(this.datas[i].username.includes(this.search1) || this.datas[i].first_name.includes(this.search1) || this.datas[i].last_name.includes(this.search1) || this.datas[i].email.includes(this.search1))
        //       this.tableData.push(this.datas[i])
        // }
      }
    }
  }
};
</script>


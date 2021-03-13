<template>

  <div id="productLinks">
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/index' }">首頁</el-breadcrumb-item>
   <el-breadcrumb-item>商品連結管理</el-breadcrumb-item>
   </el-breadcrumb>
   <h3 style="margin-top:20px;color:#696969;">商品連結管理 - {{product_name}}</h3>

   <div class="input-group" slot="header" style="margin-top:20px">
     <div style="margin-top:10px; margin-bottom:10px;float:right;margin-right: 37px;">
     <el-button type="primary" @click="addLink">新增</el-button>
   </div>
    <el-input  v-model="search1" style="width:300px">
     <el-button slot="append" @click="query()" i-con="el-icon-search">查詢</el-button>
   </el-input>
    </div>


  <el-table :data="tableData" style="width: 100%;margin-top:20px">
            <el-table-column prop="id" label="Id" width="80">
            </el-table-column>
            <el-table-column prop="distributor" label="發行者" width="180">
            </el-table-column>
            <el-table-column prop="link" label="商品連結" >
            </el-table-column>
            <el-table-column  label="商品" >{{product_name}}
            </el-table-column>
            <el-table-column width="150">
         <template slot-scope="scope" >
                        <!-- 修改按鈕 -->
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 刪除按鈕 -->
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)"></el-button>
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
        <!-- <el-button @click="upPage">上一頁</el-button>
     <el-button @click="downPage">下一頁</el-button> -->
  </div>
  <!-- 新增使用者的對話方塊 -->
        <el-dialog
            title="新增商品連結"
            :visible.sync="dialogVisible"
            width="70%"
            >
            <!-- 內容的主體區域 -->
            <el-form ref="addFormRef" :model="addForm"  label-width="100px">
        <el-form-item label="發行者" prop="distributor">
          <el-input  v-model="addForm.distributor" ></el-input>
        </el-form-item>
        <el-form-item label="商品連結" prop="link">
          <el-input  v-model="addForm.link" ></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="product">
          <el-input v-model="addForm.product" disabled></el-input>
        </el-form-item>
            </el-form>
            <!-- 底部區域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addProduct">確 定</el-button>
            </span>
        </el-dialog>
       <!-- 修改使用者的對話方塊 -->
    <el-dialog
      title="修改商品連結"
      :visible.sync="editDialogVisible"
      width="70%"
     >
      <el-form :model="editForm"  ref="editFormRef" label-width="100px">
           <el-form-item label="發行者" prop="distributor">
          <el-input  v-model="editForm.distributor" ></el-input>
        </el-form-item>
        <el-form-item label="商品連結" prop="link">
          <el-input  v-model="editForm.link" ></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="product">
          <el-input v-model="editForm.product" disabled></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editProductsInfo">確 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>
<script>
import axios from "axios";

const url = "/api/product_link";
const url_p = "/api/product_link/all?product_id=";
export default {
  name: "products",

  data() {
    return {
      tableData: [],
      editDialogVisible: false,
      dialogVisible: false,
      datas: [],
      editForm: [],
      idvalue: "",
      product_id: "",
      product_name: "",
      page: "",
      search1: "",
      nxt_page: "",
      pre_page: "",
      addForm: [],
      editFormRules: {
        distributor: [
          { required: true, message: "請輸入發行者", trigger: "blur" }
        ],
        link: [{ required: true, message: "請輸入連結", trigger: "blur" }],
        product: [{ required: true, message: "請輸入商品", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.idvalue = this.$route.query.product;
      const product = "/api/products/";
      axios.get(`${product + this.idvalue}`).then(
        response => {
          this.product_name = response.data.title;
        },
        response => {
          console.log(response.error);
        }
      );

      this.page = 1;
      axios.get(`${url_p + this.idvalue}`).then(
        response => {
          console.log(response.data);
          this.tableData = response.data;
          if (this.tableData.length < 1) {
            alert("此商品尚未有外部連結");
          }
          console.log(this.datas);
        },
        response => {
          console.log(response.error);
        }
      );
    },
    upPage() {
      this.pre_page = this.pre_page.replace("https", "http");
      axios.get(`${this.pre_page}`).then(
        response => {
          //console.log(response.data);
          this.tableData = response.data.results;
          this.pre_page = response.data.previous;
          this.nxt_page = response.data.next;
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
        },
        response => {
          console.log(response.data);
        }
      );
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      const url1 = url + "/" + id;
      axios.get(`${url1}`).then(
        response => {
          console.log(response.data);
          this.editForm = response.data;
        },
        response => {
          console.log(response.error);
        }
      );
      this.product_id = id;
    },
    editProductsInfo: function(event) {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        // 發起修改使用者資訊的資料請求
        alert(this.product_id);
        const url1 = url + "/" + this.product_id;
        axios
          .put(`${url1}`, {
            distributor: this.editForm.distributor,
            link: this.editForm.link,
            product: this.idvalue
          })
          .then(response => {
            console.log(response.data);
            location.reload();
          })
          .catch(err => {
            console.log(err);
          });

        // 關閉對話方塊
        this.editDialogVisible = false;
      });
    },
    addLink() {
      this.dialogVisible = true;
      this.addForm.product = this.idvalue;
    },
    addProduct() {
      this.$refs.addFormRef.validate(async valid => {
        // 校驗失敗
        if (!valid) return;

        axios
          .post(`${url}`, {
            distributor: this.addForm.distributor,
            link: this.addForm.link,
            product: this.idvalue
          })
          .then(res => {
            // console.table(res.data)
            location.reload();
          })
          .catch(error => {
            console.error(error);
          })
          .finally(() => {
            /* 不論失敗成功皆會執行 */
          });
        // 隱藏新增使用者的對話方塊
        this.dialogVisible = false;
      });
    },
    removeById(id) {
      // 彈框詢問使用者是否刪除資料
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
    }
  }
};
</script>
<template>

  <div id="products">
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/index' }">首頁</el-breadcrumb-item>
   <el-breadcrumb-item>商品管理</el-breadcrumb-item>
   </el-breadcrumb>
   <h3 style="margin-top:20px;color:#696969;">商品管理</h3>

   <div class="input-group" slot="header" style="margin-top:20px">
     <div style="margin-top:10px; margin-bottom:10px;float:right;margin-right: 37px;">
     <el-button type="primary" @click="openForm()">新增</el-button>
   </div>
   <el-label style="color:#696969; ">商品類型: </el-label>
    <el-input  v-model="search1" placeholder="請輸入商品類型" style="width:150px;margin-right:10px"></el-input>
    <el-label style="color:#696969;">商品名稱 : </el-label>
    <el-input  v-model="search2" placeholder="請輸入商品名稱" style="width:200px;margin-right:10px"> </el-input>
    <el-button slot="append" @click="query()"  i-con="el-icon-search">查詢</el-button>

    </div>


  <el-table :data="tableData" style="width: 100%;margin-top:20px">
            <el-table-column prop="id" label="Id" width="80">
            </el-table-column>
            <el-table-column prop="product_type" label="商品類型" width="180">
            </el-table-column>
            <el-table-column prop="title" label="商品名稱" >
            </el-table-column>
            <el-table-column prop="price" label="商品價錢" width="120">
            </el-table-column>
            <el-table-column prop="description" label="商品描述" >
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
        <el-button @click="upPage">上一頁</el-button>
     <el-button @click="downPage">下一頁</el-button>
  </div>
  <!-- 新增使用者的對話方塊 -->
        <el-dialog
            title="新增商品"
            :visible.sync="dialogVisible"
            width="60%"
            >
            <!-- 內容的主體區域 -->
            <el-form ref="addFormRef" :model="addForm"  label-width="100px">
        <el-form-item label="商品類型" prop="product_type">
          <el-input  v-model="addForm.product_type" ></el-input>
        </el-form-item>
        <el-form-item label="商品名稱" prop="title">
          <el-input  v-model="addForm.title" ></el-input>
        </el-form-item>
        <el-form-item label="商品價格" prop="price">
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input  v-model="addForm.description" ></el-input>
        </el-form-item>

        <el-form-item label="連結" prop="links">
          <el-input v-model="addForm.links"></el-input>

        </el-form-item>
         <el-form-item label="上傳圖片" >
              <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
          </el-form-item>
        <el-form-item label="商品圖片" prop="image">
           <img :src="addForm.image" width="500px" height="300px"   />
        </el-form-item>
         <el-form-item label="商品內容"  prop="content">
           <quill-editor
            v-model="addForm.content"
            ref="myQuillEditor"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
        </quill-editor>
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
      title="修改商品內容"
      :visible.sync="editDialogVisible"
      width="70%"
     >
      <el-form :model="editForm"  ref="editFormRef" label-width="100px">
         <el-form-item label="商品類型" prop="product_type">
          <el-input  v-model="editForm.product_type" ></el-input>
        </el-form-item>
        <el-form-item label="商品名稱" prop="title">
          <el-input  v-model="editForm.title" ></el-input>
        </el-form-item>
        <el-form-item label="商品價格" prop="price">
          <el-input type="number" v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input  v-model="editForm.description" ></el-input>
        </el-form-item>
        <el-form-item label="外部連結" prop="id">
          <!-- <div class="moreRulesIn" v-for="(item, index) in Linksdata" :key="item.id">
            <el-form-item class="rules" label="發行者:" :prop="Linksdata[index].distributor" style='margin-top:20px'>
            <el-input v-model="item.distributor"  ></el-input>
            </el-form-item>
          <el-form-item class="rules" label="連結:" :prop='Linksdata[index].link' style='margin-top:20px'>
          <el-input v-model="item.link"  ></el-input>
          </el-form-item>
          <el-button @click="deleteLinks(item, index)" >删除</el-button>
          </div> -->
          <router-link :to="{path:'/index/productLinks',query: {product: editForm.id}}">添加</router-link>
           <!-- <el-button type="text"  @click="addLinks"><i class="iconfont icon-tianjialianxiren"></i>添加</el-button> -->
        </el-form-item>
          <el-form-item label="上傳圖片" >
              <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
          </el-form-item>
        <el-form-item label="商品圖片" prop="image">
            <img :src="editForm.image" width="500px" height="300px"   />
        </el-form-item>
        <el-form-item label="商品內容" prop="content">
        <quill-editor
            v-model="editForm.content"
            ref="myQuillEditor"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
        </quill-editor>
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
import { quillEditor, Quill } from "vue-quill-editor";
import axios from "axios";

const url = "/api/products";
const url_p = "/api/products?page=";
export default {
  name: "products",

  data() {
    return {
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
      search1: "",
      search2: "",
      datas: [],
      file: "",
      Linksdata: {}
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    onEditorReady(editor) {},
    //  onEditorBlur(quill){
    //    this.content=quill.container.firstChild.innerHTML
    //  },
    onEditorFocus() {}, // 獲得焦點事件
    onEditorChange({ editor, html, text }) {
      console.log("editor change!", editor, html, text);
      this.editForm.content = html;
      this.addForm.content = html;
    },
    getData() {
      this.page = 1;
      axios.get(`${url_p + this.page}`).then(
        response => {
          //console.log(response.data);
          this.tableData = response.data.results;
          this.datas = response.data.results;
          this.nxt_page = response.data.next;
          this.pre_page = url_p + this.page;
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
      this.Linksdata = [];
      this.editDialogVisible = true;
      const url1 = url + "/" + id;
      axios.get(`${url1}`).then(
        response => {
          console.log(response.data);
          this.editForm = response.data;
          const img = this.editForm.image.replace("https", "http");
          this.editForm.image = img;
          this.Linksdata = this.editForm.links;
        },
        response => {
          console.log(response.error);
        }
      );
      console.log(this.Linksdata);
      this.idvalue = id;
    },
    update(e) {
      // 上傳照片
      this.file = e.target.files[0];
      const reader = new FileReader(); //建立FileReader 監聽 Load 事件
      reader.addEventListener("load", this.imageLoader);
      reader.readAsDataURL(this.file);
    },
    imageLoader(event) {
      this.editForm.image = event.target.result;
      this.addForm.image = event.target.result;
    },
    editProductsInfo: function(event) {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        const url1 = url + "/" + this.idvalue;
        const base64Img = await this.getBase64(this.file);
        let params = {
          product_type: this.editForm.product_type,
          title: this.editForm.title,
          description: this.editForm.description,
          link: this.editForm.link,
          price: this.editForm.price,
          content: this.editForm.content,
          links: this.editForm.links,
          image: base64Img
        };
        axios
          .put(`${url1}`, params)
          .then(response => {
            console.log(response.data);
            this.idvalue = "";
            location.reload();
          })
          .catch(err => {
            console.log(err);
          });

        // 關閉對話方塊
        this.editDialogVisible = false;
      });
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    addProduct() {
      this.$refs.addFormRef.validate(async valid => {
        // 校驗失敗
        if (!valid) return;
        // 校驗成功，可以發起新增使用者的網路請求
        const base64Img = await this.getBase64(this.file);
        let params = {
          product_type: this.addForm.product_type,
          title: this.addForm.title,
          description: this.addForm.description,
          link: this.addForm.link,
          price: this.addForm.price,
          content: this.addForm.content,
          links: this.addForm.links,
          image: base64Img
        };
        axios
          .post(`${url}`, params)
          .then(res => {
            // console.table(res.data)
            location.reload();
          })
          .catch(error => {
            console.error(error);
            if (error.response.data != "") {
              this.$message.error("信箱: " + error.response.data.email);
            }
          })
          .finally(() => {
            /* 不論失敗成功皆會執行 */
          });
        // this.$message.success("新增使用者成功！");
        // 隱藏新增使用者的對話方塊
        this.dialogVisible = false;
      });
    },
    removeById(id) {
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
    addLinks() {
      this.$router.push("/index/productLinks");
    },
    deleteLinks(item, index) {
      this.index = this.Linksdata.indexOf(item);
      if (index !== -1) {
        this.Linksdata.splice(index, 1);
      }
    },
    query() {
      if ((this.search1 == "") & (this.search2 == "")) {
        this.getData();
      } else {
        var params = "";
        if ((this.search1 != "") & (this.search2 == "")) {
          params = "product_type=" + this.search1;
        } else if ((this.search1 == "") & (this.search2 != "")) {
          params = "title=" + this.search2;
        } else {
          params =
            "product_type=" + this.search1 + "&" + "title=" + this.search2;
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
      }
    },
    openForm() {
      this.dialogVisible = true;
      this.addForm.content = "";
      this.addForm.image = "";
    }
  }
};
</script>
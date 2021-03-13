<template>

  <div id="user">
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/index' }">首頁</el-breadcrumb-item>
   <el-breadcrumb-item>Banner管理</el-breadcrumb-item>
   </el-breadcrumb>
   <h3 style="margin-top:20px;color:#696969;">Banner管理</h3>
      <div class="form-box">
            <el-form  label-width="80px">
                <el-form-item label="類別-標題">
                   <el-select v-model="select" @change="Select(select)" placeholder="請選擇" style="width:150px">
                        <el-option
                         v-for="item in options"
                          :key="item.id"
                          :label="item.banner_type +' - '+ item.title"
                          :value="item.id">
                        </el-option>
                        <el-option key="999" value="999">新增</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="圖片類別">
                    <el-input  v-model="banner_type" placeholder="必填" style="width:200px">{{banner_type}}</el-input>
                </el-form-item>
                 <el-form-item label="圖片標題">
                    <el-input  v-model="banner_title" placeholder="必填" style="width:200px">{{banner_title}}</el-input>
                </el-form-item>
                <el-form-item label="輪播順序" >
                    <el-input  v-model="index" type="number" style="width:200px">{{index}}</el-input>
                </el-form-item>
                <el-form-item label="圖片內容" >
                    <el-input type="textarea" placeholder="必填" v-model="description" style="width:500px">{{description}}</el-input>
                </el-form-item>
                 <el-form-item label="上傳圖片" >
                <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
                </el-form-item>
                <el-form-item label="圖片" >
                    <img :src="imgUrl" width="500px" height="300px"   />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addbtn">新增</el-button>
                    <el-button type="primary" @click="savebtn">儲存</el-button>
                    <el-button type="primary"  v-on:click="deletebtn" >刪除</el-button>
                </el-form-item>
            </el-form>
        </div>




     </div>

</template>

<script>
import axios from "axios";
const url = "/api/banners";
export default {
  name: "banners",

  data() {
    return {
      banner_type: "",
      banner_title: "",
      description: "",
      index: "",
      options: [],
      id_value: "",
      imgUrl: "",
      file: ""
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      axios.get(`${url}`).then(
        response => {
          //console.log(response.data);
          this.options = response.data.results;
        },
        response => {
          console.log(response.error);
        }
      );
    },

    Select(value) {
      this.id_value = value;
      if (value == "999") {
        location.reload();
        this.idvalue = "";
      } else {
        for (var i = 0; i < this.options.length; i++) {
          if (this.options[i].id == value) {
            this.banner_type = this.options[i].banner_type;
            this.banner_title = this.options[i].title;
            this.description = this.options[i].description;
            this.index = this.options[i].index;
            const img = this.options[i].image.replace("https", "http");
            this.imgUrl = img;
            break;
          }
        }
      }
    },
    update(e) {
      // 上傳照片
      this.file = e.target.files[0];
      const reader = new FileReader(); //建立FileReader 監聽 Load 事件
      reader.addEventListener("load", this.imageLoader);
      reader.readAsDataURL(this.file);
      //let param = new FormData() // 建立form物件
      //param.append('file', file) // 通過append向form物件新增資料
    },
    imageLoader(event) {
      this.imgUrl = event.target.result;
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async addbtn() {
      if (this.id_value != "") {
        this.$message.error("已有此文章，請點選儲存");
      } else {
        if (this.banner_type != "" && this.banner_title != "") {
          const base64Img = await this.getBase64(this.file);
          const params = {
            banner_type: this.banner_type,
            title: this.banner_title,
            index: this.index,
            description: this.description,
            image: base64Img
          };
          axios
            .post(`${url}`, params)
            .then(res => {
              console.log(res.data);
              location.reload();
            })
            .catch(error => {
              console.error(error);
              if (error.response.data != "") {
                this.$message.error(error.response.data.image);
              }
            })
            .finally(() => {
              /* 不論失敗成功皆會執行 */
            });
        } else {
          this.$message.warning("文章類別或標題不得為空");
        }
      }
      this.id_value = "";
    },
    async savebtn() {
      if (this.id_value != "") {
        if (this.file != "") {
          const url1 = url + "/" + this.id_value;
          const base64Img = await this.getBase64(this.file);
          const params = {
            banner_type: this.banner_type,
            title: this.banner_title,
            index: this.index,
            description: this.description,
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
        } else {
          this.$message.error("請上傳圖片");
        }
      } else {
        this.$message.error("尚未有此文章，請點選新增");
      }
    },
    deletebtn() {
      if (this.id_value != "") {
        if (confirm("確定刪除此圖片?")) {
          // 發起刪除使用者資訊的資料
          const url2 = url + "/" + this.id_value; // origin api ur
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
      } else {
        this.$message.warning("請選擇刪除圖片");
      }
    }
  }
};
</script>
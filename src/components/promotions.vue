<template>

  <div id="user">
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/index' }">首頁</el-breadcrumb-item>
   <el-breadcrumb-item>優惠活動管理</el-breadcrumb-item>
   </el-breadcrumb>
   <h3 style="margin-top:20px;color:#696969;">優惠活動管理</h3>
      <div class="form-box">
            <el-form  label-width="80px">
                <el-form-item label="標題">
                   <el-select v-model="select" @change="Select(select)" placeholder="請選擇" style="width:150px">
                        <el-option
                         v-for="item in options"
                          :key="item.id"
                          :label="item.title"
                          :value="item.id">
                        </el-option>
                        <el-option key="999" value="999">新增</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="優惠類別">
                    <el-input  v-model="article_type" placeholder="promotions" style="width:200px" disabled ></el-input>
                </el-form-item>
                 <el-form-item label="優惠標題">
                    <el-input  v-model="article_title" placeholder="必填" style="width:200px">{{article_title}}</el-input>
                </el-form-item>
                <el-form-item label="優惠連結">
                    <el-input  v-model="article_link" placeholder="必填" style="width:500px">{{article_link}}</el-input>
                </el-form-item>
                 <el-form-item label="上傳圖片" >
                <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
                </el-form-item>
                <el-form-item label="優惠圖片" >
                    <img :src="imgUrl" width="500px" height="300px"   />
                </el-form-item>
                <!-- <el-form-item label="優惠內容" >
                     <quill-editor
                        v-model="content"
                        ref="myQuillEditor"
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)"  style="background:#fff">
                      </quill-editor>
                </el-form-item> -->

                <el-form-item>
                    <el-button type="primary" @click="addbtn">新增</el-button>
                    <el-button type="primary" @click="savebtn">儲存</el-button>
                    <el-button type="primary" v-on:click="deletebtn">刪除</el-button>
                </el-form-item>
            </el-form>
        </div>

     </div>

</template>

<script>
import axios from "axios";

const url = "/api/articles";
export default {
  name: "promotions",

  data() {
    return {
      article_type: "",
      article_title: "",
      article_content: "",
      article_link: "",
      imgUrl: "",
      file: "",
      options: [],
      id_value: "",
      content: ""
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
    getData() {
      const url_p = url + "?article_type=promotions";
      axios.get(`${url_p}`).then(
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
            //  this.article_type=this.options[i].article_type
            this.article_title = this.options[i].title;
            this.content = this.options[i].content;
            this.article_link = this.options[i].link;
            const img = this.options[i].image.replace("https", "http");
            this.imgUrl = img;
            break;
          }
        }
      }
    },
    onEditorReady(editor) {},
    //  onEditorBlur(quill){
    //    this.content=quill.container.firstChild.innerHTML
    //  },
    onEditorFocus() {}, // 獲得焦點事件
    onEditorChange({ editor, html, text }) {
      console.log("editor change!", editor, html, text);
      this.content = html;
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
    async addbtn() {
      if (this.id_value != "") {
        this.$message.error("已有此文章，請點選儲存");
      } else {
        if (this.article_type != "" && this.article_title != "") {
          const base64Img = await this.getBase64(this.file);
          const params = {
            article_type: "promotions",
            title: this.article_title,
            link: this.article_link,
            content: this.content,
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
            })
            .finally(() => {
              /* 不論失敗成功皆會執行 */
            });
        } else {
          this.$message.warning("優惠標題不得為空");
        }
      }
      this.id_value = "";
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async savebtn() {
      if (this.id_value != "") {
        const params = {
          article_type: "promotions",
          title: this.article_title,
          link: this.article_link,
          content: this.content
        };
        if (this.file != "") {
          const base64Img = await this.getBase64(this.file);
          params["image"] = base64Img;
        }
        const url1 = url + "/" + this.id_value;
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
        this.$message.error("尚未有此文章，請點選新增");
      }
    },
    deletebtn() {
      if (this.id_value != "") {
        //    const confirmResult =  this.$confirm('此操作將永久刪除該使用者, 是否繼續?', '提示', {
        //     confirmButtonText: '確定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        // })

        //.then(()=>{
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
        //)}
        this.$message.warning("請選擇刪除文章");
      }
    }
  }
};
</script>
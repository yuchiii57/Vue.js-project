<template>
  <div class="text-center">
    <form class="form-signin" >
      <div class="store-name">Woky Store</div>
      <h3 class="mb-3">後台管理系統</h3>
      <!-- <h1 class="h4 mb-3 font-weight-normal">Please sign in</h1> -->
      <!-- <label for="inputEmail" class="sr-only">Email address</label> -->
      <input id="inputEmail" class="form-control" v-model="email" placeholder="Email address" required="" autofocus="" type="email">

      <!-- <label for="inputPassword" class="sr-only">Password</label> -->
      <input id="inputPassword" class="form-control" v-model="password" placeholder="Password" required="" type="password">
      <div class="checkbox mb-3">
        <!-- <label>
          <input value="remember-me" type="checkbox"> Remember me
        </label> -->
      </div>
      <el-button class="btn btn-lg btn-primary btn-block" type="submit" @click="Signin">登入</el-button>
      <el-button class="btn btn-lg btn-primary btn-block" type="submit"  @click="dialogVisible=true">註冊</el-button>

    <el-dialog
            title="註冊"
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

            </el-form>
            <!-- 底部區域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">確 定</el-button>
            </span>
        </el-dialog>
 </form>


  </div>
</template>

<script>
import axios from "axios";
import store from "../store/index.js";

const url = "/api/users";

export default {
  name: "login",
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
      email: "",
      password: "",
      userToken: "",
      dialogVisible: false,
      users: [],
      addForm: [],
      is_staff: "",

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
      }
    };
  },
  methods: {
    Signin() {
      //this.$router.push('/index');
      if (this.email === "" || this.password === "") {
        alert("帳號密碼不得為空");
      } else {
        let email = this.email;
        let password = this.password;
        store
          .dispatch("login", { email, password })
          .then(() => this.$router.push("/index"))
          .catch(err => console.log(err));
      }
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // 如果valid的值為true，說明預校驗成功，反之則校驗失敗
        // console.log(valid)
        // 校驗失敗
        if (!valid) return;
        let config = {
          headers: { "Content-Type": "application/json" }
        };
        // 校驗成功，可以發起新增使用者的網路請求
        axios
          .post(`${url}`, {
            username: this.addForm.username,
            email: this.addForm.email,
            password: this.addForm.password,
            last_name: this.addForm.last_name,
            first_name: this.addForm.first_name,
            is_staff: "0"
          })
          .then(response => {
            console.table(response.data);

            this.$message.success("新增成功！");
            this.addForm.username = "";
            this.addForm.email = "";
            this.addForm.password = "";
            this.addForm.last_name = "";
            this.addForm.first_name = "";
          })
          .catch(error => {
            console.error(error);
            if (error.response.data != "") {
              this.$message.error("Email: " + error.response.data.detail);
              this.addForm.username = "";
              this.addForm.email = "";
              this.addForm.password = "";
              this.addForm.last_name = "";
              this.addForm.first_name = "";
            }
          })
          .finally(() => {
            /* 不論失敗成功皆會執行 */
          });

        this.dialogVisible = false;
        // 重新獲取使用者列表資料
      });
    }
  }
};
</script>

<style scoped>
/* *{
  box-sizing: border-box;
} */
html,
body {
  height: 100%;
}
body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}
.mb-3 {
  text-align: center;
  margin-bottom: 20px;
}

.form-signin {
  width: 100%;
  max-width: 360px;
  padding: 15px;
  margin: auto;
  text-align: center;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.store-name {
  font-family: "Knewave", cursive;
  font-size: 56px;
  margin: 16px 0;
  padding: 5px 10px;
  background: -webkit-linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
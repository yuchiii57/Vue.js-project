import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {}
  },

  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token, email) {
      state.status = 'success'
      state.token = token
      state.email = email
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },
  actions: {
    login({ commit }, email) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        const url = '/api/users/login';
        //axios({url: `${url}`, data: user, method: 'POST' },config)
        axios.post(`${url}`, email)
          .then(resp => {
            const token = resp.data.token
            const email = resp.data.email
            const staff = resp.data.is_staff
            if (staff == true) {
              localStorage.setItem('token', token)
              localStorage.setItem('email', email)
              axios.defaults.headers.common['Authorization'] = token
              commit('auth_success', token, email)
              resolve(resp)
            }
            else {
              alert('您沒有登入權限')
            }
          })
          .catch(err => {
            commit('auth_error')
            alert(err.response.data.detail)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },

  }
});

export default store;
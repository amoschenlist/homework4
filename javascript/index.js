import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  data() {
    return {
	  apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api = `${this.apiUrl}/admin/signin`;
      axios.post(api, this.user).then((response) => {
        const { token, expired } = response.data;
        // 寫入 cookie token
        // expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
        //window.location = 'products_homework3.html'; //作業3
		window.location = 'products_homework4.html';  //作業4
      }).catch((error) => {
        alert(error.data.message);
      });
    },
  },
}).mount('#app');

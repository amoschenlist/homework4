import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";

let productItemModal = null;
let delProductItemModal = null;

createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "amos-hexschool",
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
    };
  },
  methods: {
    // 驗證權限後取出產品
    checkAuthRender() {
      const url = `${this.apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "index.html";
        });
    },

    // 取得產品資料
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios
        .get(url)
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    // 開啟明細資料的暫存物件
    openItemProduct(item) {
      this.tempProduct = item;
    },

    // 按下按鈕新增/修改/刪除
    openItemModal(type, item) {
      if (type === "new") {
        //新增
        this.tepmProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productItemModal.show(); //顯示productModal
      } else if (type === "edit") {
        //修改
        this.tempProduct = { ...item };
        this.isNew = false;
        productItemModal.show(); // 顯示productModal
      } else if (type === "delete") {
        //刪除
        this.tempProduct = { ...item };
        delProductItemModal.show(); //顯示delProductModal
      }
    },

    // 刪除產品
    delItemProduct() {
      //要刪除的產品api路徑
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      // 使用delete api 刪除一項產品
      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          delProductItemModal.hide(); //隱藏delProductModal
          this.getData(); //重新render產品列表
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    //新增或編輯產品
    updateItemProduct() {
      let url = "";
      let http = "";
      if (this.isNew) {
        //this.isNew為true,新增產品
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        http = "post";
      } else if (!this.isNew) {
        //this.isNew為false,編輯產品
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }
      // axios API 新增或編輯產品
      axios[http](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          productItemModal.hide(); //隱藏ProductModal
          this.getData(); //重新render產品列表
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    //新增圖片
    createImagesLink() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    // 驗證權限後取出產品
    this.checkAuthRender();

    // 啟用productModal
    productItemModal = new bootstrap.Modal(
      document.getElementById("productItemModal"),
      {
        keyboard: false,
      }
    );

    // 啟用delProductModal
    delProductItemModal = new bootstrap.Modal(
      document.getElementById("delProductItemModal"),
      {
        keyboard: false,
      }
    );
  },
}).mount("#app");

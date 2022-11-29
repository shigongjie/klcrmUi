<template>
  <div :id="id"></div>
</template>

<script>
  import E from 'wangeditor'
  import './editor.css'
  export default {
    name: 'wangeditor',
    props: {
      options: {
        type: Object,
        default: _ => {
          return {}
        }
      },
      id: {
        type: String,
        default: `editor-${Date.now()}`
      },
      initContent: String,
      value: String
    },
    data() {
      return {
        editor: {},
        defaultOpts: {
          withCredentials: true,
          uploadImgHeaders: {},
          uploadImgMaxSize: 10 * 1024 * 1024, // 限制图片大小
          uploadFileName: 'fileList', // 自定义 fileName
          uploadImgServer: ``,
          uploadImgHooks: {
            customAlert(info) {
              // 上传图片的错误提示
              // info 是需要提示的内容
              Vue.prototype.$Message.error(`图片上传失败(${info})`);
            },
            fail(xhr, editor, result) {
              // 图片上传并返回结果，但图片插入错误时触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
              Vue.prototype.$Message.error(`图片上传失败(${result.msg})`);
            },
            error(xhr, editor) {
              // 图片上传出错时触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
              Vue.prototype.$Message.error('图片上传失败, 请稍后重试');
            },
            timeout(xhr, editor) {
              // 图片上传超时时触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
              Vue.prototype.$Message.error('图片上传超时, 请稍后重试');
            },
            // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
            // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
            customInsert(insertImg, result, editor) {
              // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
              // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

              // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
              if (+result.code === 0) {
                let url = ((result.data || [])[0] || {}).url;
                insertImg(url);
              } else {
                Vue.prototype.$Message.error('图片上传失败, 请稍后重试');
              }
            }
          },
          emotions: [{
            // tab 的标题
            title: '默认',
            // type -> 'emoji' / 'image'
            type: 'image',
            // content -> 数组
            content: require('./emotions')
          }]

        }
      }
    },
    computed: {
      editorEle() {
        if (document.querySelector(`#${this.id}`)) {
          return document.querySelector(`#${this.id}`);
        }
      },
      toolbar() {
        if (document.querySelector(`#${this.id} .w-e-toolbar`)) {
          return document.querySelector(`#${this.id} .w-e-toolbar`);
        }
      },
      container() {
        if (document.querySelector(`#${this.id} .w-e-text-container`)) {
          return document.querySelector(`#${this.id} .w-e-text-container`);
        }
      },
      textWrap() {
        if (document.querySelector(`#${this.id} .w-e-text`)) {
          return document.querySelector(`#${this.id} .w-e-text`);
        }
      }
    },
    methods: {
      createBtn(btnHtml) {
        let btn = document.createElement('div');
        btn.className = 'w-e-menu';
        btn.style.zIndex = '10001';
        btn.innerHTML = btnHtml;
        return btn;
      },
      initSize() {
        if (this.options.width) {
          this.container.style.width = this.options.width;
          this.toolbar.style.width = this.options.width;
        }
        if (this.options.height) {
          this.container.style.height = this.options.height;
        }
      }
    },
    mounted() {
      this.editor = new E('#' + this.id);

      // init change event
      this.editor.customConfig.onchange = html => {
        this.$emit('input', html);
        this.$emit('update:text', this.editor.txt.text());
      }

      // init props options
      Object.assign(this.defaultOpts, this.options);
      Object.keys(this.defaultOpts).map(property => {
        this.editor.customConfig[property] = this.defaultOpts[property];
      })

      // create the editor
      this.editor.create();
      this.editor.txt.html(this.initContent);

      this.initSize();

    }
  }
</script>

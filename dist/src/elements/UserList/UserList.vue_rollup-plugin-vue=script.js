import e from"../UserEditModal/UserEditModal.vue.js";var t={name:"UserList",props:{server:String},data:()=>({users:[],openModal:!1,userToEdit:null}),created(){setTimeout(()=>{this.users=[{id:1,name:"Matt Laue",email:"matt@zuar.com",groups:["Administrator"],permissions:["Read","Write","Edit","Delete"]},{id:2,name:"Dylan Spurgin",email:"dylan@dylanspurgin.com",groups:["Editor"],permissions:["Read","Write","Edit"]}]},300),document.addEventListener("user-created.ft",(e,t)=>{console.debug("user-created.ft",e),this.users.push(e.detail.user)}),document.addEventListener("user-edited.ft",(e,t)=>{console.debug("user-edited.ft",e),Object.assign(this.users.find(t=>t.id===e.detail.user.id),e.detail.user)})},methods:{onEditClick(e){console.debug("edit click",e),this.userToEdit=e,this.openModal=!0},onModalClose(){this.openModal=!1}},components:{UserEditModal:e}};export default t;
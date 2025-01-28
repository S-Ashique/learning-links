import{formSubmitValidation,validateField,validationRules}from"./extras/auth_validation.js";import{errorMessage}from"./extras/toaster.js";$(document).ready((()=>{const $form=$("#sign_in_form");const $button=$("#sign_in_button");$form.find("input").on("input",(async e=>{const inputId=e.target.id;validateField(`${inputId}_container`,e.target.value,validationRules[inputId].regex,validationRules[inputId].errorMessage)}));$form.submit((async e=>{e.preventDefault();$button.prop("disabled",true).text("Signing In ...");let formData=new FormData;formData.append("email",$form.find("input[id='email']").val());formData.append("password",$form.find("input[id='password']").val());let isValid=await formSubmitValidation(formData);try{if(isValid){formData.append("csrfmiddlewaretoken",$form.find("[name=csrfmiddlewaretoken]").val());var currentUrl=window.location.pathname;var role=currentUrl.split("/")[3];const url=role==="superuser"?"/auth/sign-in/superuser/":"/auth/sign-in/user/";await $.ajax({method:"POST",data:formData,url:url,processData:false,contentType:false,success:data=>{const urlParams=new URLSearchParams(window.location.search);const redirect=urlParams.get("redirect");let redirectUrl;if(redirect){redirectUrl=redirect}else{if(data.role&&data.role==="superuser"){redirectUrl="/superuser/"}else{redirectUrl="/"}}window.location.replace(redirectUrl)}})}}catch(error){errorMessage(error)}$button.prop("disabled",false).text("Sign In")}))}));
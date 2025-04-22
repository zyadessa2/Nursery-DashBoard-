import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bounce, toast } from 'react-toastify'
import * as Yup from 'yup'
import TransitionEffect from '../components/TransitionEffect'

const Login = () => {
   let navigate = useNavigate() // to let user to go to (home )
    const [error , seterror] = useState(null)
    const [isLoading , setisLoading] = useState(false)
  
    async function Loginsubmit(values) {
      setisLoading(true); // تشغيل اللودينج قبل بدء العملية
    
      try {
        // إرسال الطلب إلى الـ API
        const { data } = await axios.post(`https://icpc-hti.vercel.app/api/auth/login`, values);
    
        // التأكد من نجاح العملية
        if (data.success) {                
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        //   setUserToken(data.token);
        //   setUserData(data.user)
          toast.success("Login seccufuly 🎉", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
          navigate("/");
        }
      } catch (err) {
        // التعامل مع الأخطاء
        seterror(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
        console.error(err);
        toast.error(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
      } finally {
        // إيقاف اللودينج بعد انتهاء العملية سواء كانت ناجحة أو فشلت
        setisLoading(false);
      }
    }
  
  
    let validateYup = Yup.object({
      email: Yup.string().email('email is invalid').required('email is requierd'),
      password:Yup.string().required('password is requierd'),
    })
  
  
    let formik = useFormik({
      initialValues:{
        email:'',
        password:'',
      },
      validationSchema:validateYup
      ,
      onSubmit:Loginsubmit // دى لما بتشغل الفانكشن دى بتبعت معاها لوحدها كده الفاليوز البروح استقبلها ف الفنكشن
    })
  
  
    return <>
        <TransitionEffect/>
        <main>
            <div className='login bg-slate-300 overflow-x-hidden py-32'>
                <div className="container">
                <div className=" mt-5 flex justify-center align-middle">
                    <div className=" w-[50%]">
                        {error !== null? <div className="alert alert-danger">{error}</div> : ""}
                        <form onSubmit={formik.handleSubmit} className='mt-5 '>
                            <label for="email" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange}  type="email" id='email' name='email' class="mb-2 bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:border-yellow-50  block w-full p-2.5 " placeholder="ex@gmail.com" required />
                            {formik.errors.email && formik.touched.email?<div className="alert mt-2 p-2 alert-danger">{formik.errors.email}</div> : ""}
            
            
                            <label for="password" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange} type="password" id='password' name='password' class="mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder="*******" required />
                            {formik.errors.password && formik.touched.password?<div className="alert mt-2 p-2 alert-danger">{formik.errors.password}</div> : ""}
            
            
                            <div className="text-center w-100">
                            <button disabled={!(formik.isValid && formik.dirty)} type="submit" className="py-3 w-[50%] text-light font-bold rounded-xl bg-dark" >{isLoading ? "loging in..." : "LogIn"}</button>
                            <p className='mt-4'>Don't Have An Account? <Link to={'/signup'}>Signup</Link></p>
                            <p className='mt-1'><Link className=' ' to={'/resetpassword'}>Forget Your password ?</Link></p>
            
                            </div>
                            {error && <span>somthing went wrong</span>}
            
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </main>
    </>
}

export default Login
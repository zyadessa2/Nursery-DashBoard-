import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import * as Yup from 'yup';
import TransitionEffect from '../components/TransitionEffect';


const Signup = () => {
  
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    async function handleSubmit(values) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        for (let key in values) {
          formData.append(key, values[key]);
        }
        let { data } = await axios.post(`https://icpc-hti.vercel.app/api/auth/signup`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (data.success) {
          setIsLoading(false);
          navigate('/login')
        }
      } catch (err) {
        setIsLoading(false);
        setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل');
        console.error(err);
        toast.error(err.response?.data?.message || 'حدث خطأ أثناء التسجيل', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      }
    }
  
    const formik = useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
        cpassword: '',
        profilePic: null,
        phone: '',
        age: '',
        gender: 'male',
        DOB: '',
      },
      validationSchema: Yup.object({
        name: Yup.string().required('please write your name'),
        phone: Yup.number().required('write your number'),
        age: Yup.number().required('write your age'),
        email: Yup.string().email('write valid email please').required('email is required'),
        password: Yup.string().required('password is required'),
        cpassword: Yup.string()
          .required('Confirm password please')
          .oneOf([Yup.ref('password'), null], 'write correct password'),
        gender: Yup.string().oneOf(['male', 'female'], 'choose male or female'),
        DOB: Yup.date().required('Date of birth is required'),
      }),
      onSubmit: handleSubmit,
    });
  
  
    return <>
      <TransitionEffect/>
      <main>
        <div className='signUp overflow-x-hidden py-16'>
          <div className="container">
            <div className="flex mt-5 justify-center align-middle">
              
              <div className="w-[50%] ">
              {error !== null? <div className="alert alert-danger">{error}</div> : ""}
                <form  onSubmit={formik.handleSubmit} className='mt-5 '>
                  <div className="name d-flex justify-between w-100">
                    <div className='w-100 me-2'>
                      <label for="name" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input name='name' value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" id="name" class=" mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder=" " required />
                      {formik.touched.name && formik.errors.name ? <div className='text-red-500 fw-bold'>{formik.errors.name}</div> : null}
    
                    </div>
                    
                  </div>
                  
                  <label for="email" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input name='email' value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" id="email" class="mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder="ex@gmail.com" required />
                  {formik.touched.email && formik.errors.email ? <div className='text-red-500 fw-bold'>{formik.errors.email}</div> : null}
                  
                  <label for="password" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input name='password' value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" id="password" class="mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder="*******" required />
                  {formik.touched.password && formik.errors.password ? <div className='text-red-500 fw-bold'>{formik.errors.password}</div> : null}
                  
                  <label for="cpassword" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input name='cpassword' value={formik.values.cpassword} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" id="cpassword" class="mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder="*******" required />
                  {formik.touched.cpassword && formik.errors.cpassword ? <div className='text-red-500 fw-bold'>{formik.errors.cpassword}</div> : null}
    
                
                  <label for="profilePic" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">profilePic</label>
                  <input name='profilePic' onChange={(e) => formik.setFieldValue("profilePic", e.target.files[0])} onBlur={formik.handleBlur} type="file" id="profilePic" class="mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder="add profilePic"  />
    
                  <div className="idGender d-flex justify-between w-100">
                    <div className='w-[50%] me-2'>
                      <label for="phone" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                      <input name='phone' value={formik.values.phone} onBlur={formik.handleBlur} onChange={formik.handleChange} type="string" id="phone" class=" mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder="01023234234 " required />
                      {formik.touched.phone && formik.errors.phone ? <div className='text-red-500 fw-bold'>{formik.errors.phone}</div> : null}
    
                    </div>
                    <div className='w-[50%] me-2'>
                      <label for="age" class="block mb-0 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                      <input name='age' value={formik.values.age} onBlur={formik.handleBlur} onChange={formik.handleChange} type="string" id="age" class=" mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder="01023234234 " required />
                      {formik.touched.age && formik.errors.age ? <div className='text-red-500 fw-bold'>{formik.errors.age}</div> : null}
    
                    </div>
                  </div>       
    
                  <div className="genderBirth flex justify-between  w-100">
                      <div className="form-group w-100 my-3 me-2 ">
                      <label className="me-2">
                        <input type="radio" name="gender" value="male" checked={formik.values.gender === "male"} onChange={formik.handleChange} />
                        Male
                      </label>
                      <label>
                        <input type="radio" name="gender" value="female" checked={formik.values.gender === "female"} onChange={formik.handleChange} />
                        Female
                      </label>
                            {formik.touched.gender && formik.errors.gender ? <div className='text-red-500 fw-bold'>{formik.errors.gender}</div> : null}
    
                        </div>
                        <div className="form-group w-100 ">
                        <label className='font-medium' htmlFor="DOB">Birthday</label>
                        <input name='DOB' value={formik.values.DOB} onBlur={formik.handleBlur} onChange={formik.handleChange} type="date" id="DOB" class=" mb-2 bg-gray-50 border border-blue-700 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5" placeholder=" " required />
                        {formik.touched.DOB && formik.errors.DOB ? <div className='text-red-500 fw-bold'>{formik.errors.DOB}</div> : null}
                    </div>
                  </div>
    
                  <div className="text-center w-100">
                    <button type="submit" className="py-3 w-[50%] text-light font-bold rounded-xl bg-dark" disabled={isLoading}>
                        {isLoading ? "Signing Up..." : "Sign Up"}
                      </button>
                    <p className='mt-4'>Already Have An Account? <Link to={'/login'}>Login</Link></p>
                  </div>
                </form>        
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
}

export default Signup
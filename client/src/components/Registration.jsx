import Button from "@mui/material/Button";
import axios from 'axios';
import "./styles.css";
import { useForm } from "react-hook-form";
import {useNavigate } from "react-router-dom"

const Registration = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();



  const onSubmit = async(data) => {
    if(data.password !== data.cpassword) {
        return alert("confirm pass and pass does not match")
    }
    console.log(data)
    try {
       
       const result = await axios.post('http://localhost:5000/api/user/register', {
        name: data.name,
        password: data.password,
        email:data.email
       })
       localStorage.setItem("userInfo", JSON.stringify(result.data));
       navigate('/chat');
      //  console.log(result.data)
    } catch (error) {
       console.log(error) 
    }
  }
  return (
    <div>
     

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <input
          
          type="name"
          placeholder="Enter your name..."
          className=" text-gray-600 input-style outline-0 px-6 py-3"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className="text-red-500">This field is required</span>
        )}
        <input
         
          type="email"
          placeholder="Enter your email..."
          className=" text-gray-600 input-style outline-0 px-6 py-3"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-red-500">This field is required</span>
        )}

        <input
          type="password"
         
          className=" text-gray-600 input-style outline-0 px-6 py-3"
          placeholder="Password"
          {...register("password", { required: true })}
        />

        {errors.password && (
          <span className="text-red-500">This field is required</span>
        )}
        <input
          type="password"
         
          className=" text-gray-600 input-style outline-0 px-6 py-3"
          placeholder="Confirm Password"
          {...register("cpassword", { required: true })}
        />

        {errors.cpassword && (
          <span className="text-red-500">This field is required</span>
        )}

        <Button size="large" variant="contained" type="submit" className="btn">
          Sign Up
        </Button>
      </form>
      
    </div>
  );
};

export default Registration;

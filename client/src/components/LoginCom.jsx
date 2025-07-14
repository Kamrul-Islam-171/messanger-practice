import Button from "@mui/material/Button";
import { useState } from "react";
import "./styles.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginCom = () => {
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async(data) => {
    
    try {
       
       const result = await axios.post('http://localhost:5000/api/user/login', {
        password: data.password,
        email:data.email
       })

       if(result?.data?.success) {
        alert("Login Successfull")
       }
       localStorage.setItem("userInfo", JSON.stringify(result.data));
       navigate('/chat');
    } catch (error) {
       console.log(error) 
    }
  }
  return (
    <div>
     

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <input
          defaultValue={email}
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
          defaultValue={password}
          className=" text-gray-600 input-style outline-0 px-6 py-3"
          placeholder="Password"
          {...register("password", { required: true })}
        />

        {errors.password && (
          <span className="text-red-500">This field is required</span>
        )}

        <Button size="large" variant="contained" type="submit" className="btn">
          Login
        </Button>
      </form>
      <div className="mt-5">
        <Button
          onClick={() => {
            setEmail("guest@gmail.com"), setPassword("guest123");
          }}
          variant="outlined"
          size="large"
          className="w-full"
        >
          Login As Guest
        </Button>
      </div>
    </div>
  );
};

export default LoginCom;

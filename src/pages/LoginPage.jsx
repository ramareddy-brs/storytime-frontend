import { Link, NavLink, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";

import { login } from "../store/user/authSlice";
import { useEffect } from "react";
import { useLoginAPIMutation } from "../store/user/userApiSlice";
import { toast } from "react-toastify";

const initialValues = {
  email: "",
  password: "",
  rememberme: false,
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(40, "Password must not exceed 40 characters"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loginAPI] = useLoginAPIMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    try {
      const response = await loginAPI({
        email: values.email,
        password: values.password,
      }).unwrap();
      toast.success("You logged in successfully!");
      dispatch(login({ ...response }));
      navigate("/home");
    } catch (error) {

      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate, isLoggedIn]);

  return (
    <>
      <div className="grid place-items-center mb-3">
        <img className="w-16 h-16" src="/images/logo.svg" alt="Workflow" />
      </div>
      <div className="Auth-form-container">
        <div className="Auth-form">
          <div className="Auth-form-content">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, isSubmitting }) => (
                <Form>
                  <h3 className="Auth-form-title py-4 text-center">Sign In</h3>
                  <hr />

                  <div className="form-group mt-3 px-5 py-2 border border-gray-300 rounded-lg mx-5">
                    <label>Email</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="catherine.shaw@gmail.com"
                      className="bg-gray-50 border-0 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 px-0 bg-white outline-0"
                    />
                    <ErrorMessage
                      className="err_msg"
                      name="email"
                      component="div"
                    />
                  </div>

                  <div className="form-group mt-3 px-5 py-2 border border-gray-300 rounded-lg mx-5">
                    <label>Password</label>
                    <Field
                      name="password"
                      placeholder="Password"
                      type="password"
                      className="bg-gray-50 border-0 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 px-0 bg-white outline-0"
                    />
                    <ErrorMessage
                      className="err_msg"
                      name="password"
                      component="div"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-7  px-5">
                    <div className="flex items-center">
                      <Field
                        name="rememberme"
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="rememberme"
                        className="ml-2 text-sm text-gray-900 rounded"
                      >
                        Remember me
                      </label>
                      {/* check status of checkbox */}
                      <div>{values.rememberme ? "Checked" : "Unchecked"}</div>
                    </div>

                    <div className="text-sm">
                      <Link
                        className="font-medium linkColor hover:text-purple-500"
                        to={"/forgotpassword"}
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div className="d-grid gap-2 mt-7  px-5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`block w-full py-2 px-4 rounded-xl btnPurpleColor ${
                        isSubmitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-700 text-white font-bold"
                      }`}
                    >
                      Sign In
                    </button>
                  </div>

                  <div className="mt-3">
                    <div className="text-center text-sm text-black py-6 bg-gray-300 rounded-b-xl bg-opacity-20">
                      You don't have an account?
                      <NavLink
                        className="greyColor font-medium text-purple-600 hover:text-purple-500 text-center py-2 ml-3 linkColor"
                        to={"/register"}
                      >
                        Sign Up
                      </NavLink>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

// User account component
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserProfileAPIMutation } from "../../store/user/userApiSlice";
import { updateUserProfile } from "../../store/user/authSlice";
import { toast } from "react-toastify";
import * as Yup from "yup";

const userSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters")
    .max(15, "First Name must not exceed 15 characters"),
  last_name: Yup.string()
    .required("Last Name is required")
    .min(3, "Last Name must be at least 3 characters")
    .max(15, "Last Name must not exceed 15 characters"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
});

const Account = () => {
  const dispatch = useDispatch();
  const [updateUserProfileAPI, { isLoading }] =
    useUpdateUserProfileAPIMutation();
  const { userData } = useSelector((state) => state.auth);

  // initial values
  const initialValues = {
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
  };

  const handleSubmit = async (values) => {
    try {
      const response = await updateUserProfileAPI({
        first_name: values.first_name,
        last_name: values.last_name,
      }).unwrap();
      dispatch(
        updateUserProfile({
          first_name: values.first_name,
          last_name: values.last_name,
        })
      );
      toast.success(response.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <section>
              <div className="max-w-2xl">
                <h3 className="mt-4 mb-4">Personal Info</h3>
                <div className="mb-8">
                  <label className="text-white text-xs mb-3">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    disabled={true}
                    placeholder="Email Address"
                    className="border-0 border-b outline-none bg-transparent text-sm py-2 w-full border-opacity-25"
                  />
                  <ErrorMessage
                    className="err_msg"
                    name="email"
                    component="div"
                  />
                </div>
                <div className="mb-8">
                  <label className="text-white text-xs mb-3">First Name</label>
                  <Field
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    className="border-0 border-b outline-none bg-transparent text-sm py-2 w-full border-opacity-25"
                  />
                  <ErrorMessage
                    className="err_msg"
                    name="first_name"
                    component="div"
                  />
                </div>
                <div className="mb-8">
                  <label className="text-white text-xs mb-3">Last Name</label>

                  <Field
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    className="border-0 border-b outline-none bg-transparent text-sm py-2 w-full border-opacity-25"
                  />

                  <ErrorMessage
                    className="err_msg"
                    name="last_name"
                    component="div"
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`py-2 px-4 btnPurpleColor ${
                      isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-700 text-white font-bold"
                    }`}
                  >
                    Update
                  </button>
                </div>
              </div>
            </section>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Account;

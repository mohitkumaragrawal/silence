import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "react-notifications-component";

import LoadingButton from "../../components/LoadingButton";
import InputControl from "../../components/InputControl";
import Heading from "../../components/Heading";
import useValidator from "../../hooks/useValidator";
import { minLength, passwordValidator } from "../../validators";
import createForm from "../../helpers/createForm";
import { AuthContext } from "../../auth/auth.context";
import BlobLayout from "./BlobLayout";

export default function Login() {
  const usernameControl = useValidator(minLength(5));
  const passwordControl = useValidator(passwordValidator);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const form = createForm({
    username: usernameControl,
    password: passwordControl,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.valid) return;

    setLoading(true);
    auth.login(form.value.username, form.value.password).then((val) => {
      setLoading(false);

      if (val) {
        Store.addNotification({
          message: "successfully logged in!",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });

        console.log("login was a success");
        navigate("/");
      }
    });
  };

  return (
    <BlobLayout message="welcome back! we missed you a lot.">
      <form className="p-5 flex-1 flex flex-col gap-5" onSubmit={handleSubmit}>
        <Heading>login</Heading>

        <InputControl
          placeholder="enter username or email"
          label="username / email"
          {...usernameControl.inputProps}
        />

        <InputControl
          placeholder="enter password"
          type="password"
          label="password"
          {...passwordControl.inputProps}
        />

        <LoadingButton loading={loading} disabled={!form.valid}>
          login
        </LoadingButton>
      </form>
    </BlobLayout>
  );
}

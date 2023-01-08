import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputControl from "../../components/InputControl";
import Heading from "../../components/Heading";
import useValidator from "../../hooks/useValidator";
import {
  emailValidator,
  minLength,
  passwordValidator,
  required,
} from "../../validators";
import ValidationErrorComp from "../../components/ValidationErrorComp";
import createForm from "../../helpers/createForm";
import axios from "../../helpers/axios";
import LoadingButton from "../../components/LoadingButton";
import BlobLayout from "./BlobLayout";

export default function Signup() {
  const emailControl = useValidator(emailValidator);
  const nameControl = useValidator(required);
  const usernameControl = useValidator(minLength(5));
  const passwordControl = useValidator(passwordValidator);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = createForm({
    email: emailControl,
    name: nameControl,
    username: usernameControl,
    password: passwordControl,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.valid) return;

    setLoading(true);
    axios
      .post("/auth/signup", {
        name: form.value.name,
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
      })
      .then((res) => {
        setLoading(false);

        // Signup was successful;
        // So a notification
        // and navigate to login;
        navigate("/login");
      })
      .catch((r) => {
        setLoading(false);

        const res = r.response;
        if (res && res.data && res.data.message) {
          console.log(res.data.message);
        }
      });
  };

  return (
    <BlobLayout message="signup it's free">
      <form className="p-5 flex-1 flex flex-col gap-5" onSubmit={handleSubmit}>
        <Heading>signup</Heading>

        <InputControl
          placeholder="enter name"
          label="name"
          {...nameControl.inputProps}
        >
          <ValidationErrorComp errors={nameControl.errors} />
        </InputControl>

        <InputControl
          placeholder="enter username"
          label="username"
          {...usernameControl.inputProps}
        >
          <ValidationErrorComp errors={usernameControl.errors} />
        </InputControl>

        <InputControl
          placeholder="enter email"
          label="email"
          {...emailControl.inputProps}
        >
          <ValidationErrorComp errors={emailControl.errors} />
        </InputControl>

        <InputControl
          placeholder="enter password"
          type="password"
          label="password"
          {...passwordControl.inputProps}
        >
          <ValidationErrorComp errors={passwordControl.errors} />
        </InputControl>

        <LoadingButton loading={loading} disabled={!form.valid}>
          signup
        </LoadingButton>
      </form>
    </BlobLayout>
  );
}

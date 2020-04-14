import React from "react";

import Card from "../../../shared/components/UI/Card";
import Input from "../../../shared/components/UI/Form/Input";
import Button from "../../../shared/components/UI/Form/Button";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";

import "./index.css";

const Auth = () => {
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false
      },
      password: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const authSubmitHandler = event => {
    event.preventDefault();

    console.log(formState.inputs);
  };

  return (
    <Card className="authentication">
      <h2>Login required!</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid email password, at least 5 characters."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Login
        </Button>
      </form>
    </Card>
  );
};

export default Auth;

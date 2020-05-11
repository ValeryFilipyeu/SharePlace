//test!!!
import React, { useState, useContext } from "react";
import { withNamespaces } from "react-i18next";

import Card from "../../../components/UI/Card";
import Input from "../../../components/UI/Form/Input";
import Button from "../../../components/UI/Form/Button";
import Spinner from "../../../components/UI/Spinner";
import ErrorModal from "../../../components/UI/Error";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../../../util/validators";
import { useForm } from "../../../hooks/form-hook";
import { AuthContext } from "../../../context/auth-context";
import axios from "../../../api/axios";
import Cancellation from "axios";

import "./index.css";

const Auth = ({ t }) => {
  const CancelToken = Cancellation.CancelToken;
  const source = CancelToken.source();

  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, serError] = useState(undefined);

  const [formState, inputHandler, setFormData] = useForm(
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

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false
          }
        },
        false
      );
    }

    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    setIsLoading(true);

    if (isLoginMode) {
      try {
        await axios.post("/users/login", {
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }, {
          cancelToken: source.token
        });
        setIsLoading(false);
        auth.login();
      } catch (err) {
        setIsLoading(false);
        serError(err.message || t("Error message"));
        source.cancel("Operation canceled by the user.");
      }
    } else {
      try {
        await axios.post("/users/signup", {
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }, {
          cancelToken: source.token
        });
        setIsLoading(false);
        auth.login();
      } catch (err) {
        setIsLoading(false);
        serError(err.message || t("Error message"));
        source.cancel("Operation canceled by the user.");
      }
    }
  };

  const errorHandler = () => {
    serError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <Spinner asOverlay />}
        <h2>{t("Login auth")}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label={t("Your Name")}
              validators={[VALIDATOR_REQUIRE()]}
              errorText={t("Enter name")}
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label={t("E-Mail")}
            validators={[VALIDATOR_EMAIL()]}
            errorText={t("Valid email")}
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label={t("Password")}
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText={t("Valid password")}
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? t("Login") : t("SignUp")}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {t("Switch to")} {isLoginMode ? t("SignUp") : t("Login")}
        </Button>
      </Card>
    </>
  );
};

export default withNamespaces()(Auth);

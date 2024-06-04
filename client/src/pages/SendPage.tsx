import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import ProfileWithCoin from "../components/ProfileWithCoin";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import FooterNavbar from "../components/FooterNavbar";

const styles = require("../styles/sendPage.module.css").default;
const coin = require("../assets/images/big-coin.png");

interface User {
  user_id: string;
  name: string;
  coins: number;
}

const valueInfo = [
  "Tenacious",
  "Resourceful",
  "Open Minded",
  "Problem Solving",
  "Holistic",
  "Inquisitive",
  "Celebrating",
];

export default function SendPage() {
  const [selectedOption, setSelectedOption] = useState<string>("Tenacious");
  const [celebrationMoment, setCelebrationMoment] = useState<string>("");
  const [seletectedValues, setSelectedValues] = useState<any>([]);
  const [isCharecterExpired, setIsCharecterExpired] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [user, setUser] = useState({} as any);

  const { id } = useParams();
  const navigator = useNavigate();
  const userData: any = localStorage.getItem("userInfo");
  const data = JSON.parse(userData);

  let userId = data?.userId;
  const company_id = data?.company.id;
  var company_id_map: any = new Map();
  company_id_map.set("62fafe5c-851b-4a06-a906-d60b1833cc9b", "Become");
  company_id_map.set("8d1d7a91-c48f-44e9-90fd-e7512006397e", "MentorCloud");

  const findUserValid = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/valid-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            from_user_id: userId,
            to_user_id: id,
            value: selectedOption,
          }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        return result.isValidUser;
      }
    } catch (error) {
      console.log("error while finding valid user", error);
      return false;
    }
  };

  const handleOnChangeForTextArea = (e: any) => {
    const userInput = e.target.value;
    if (userInput.length <= 200) {
      setCelebrationMoment(userInput);
    } else {
      if (isCharecterExpired) {
        return;
      }
      setIsCharecterExpired(true);
      toast.error("character limit exceeded", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const sendCoins = async () => {
    if (celebrationMoment.length <= 20) {
      toast.warn("minimum character limit is 20", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    if (data.coins <= 0) {
      toast.warn("you don't have enough coins", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    try {
      const isValidUser = await findUserValid();
      if (!isValidUser) {
        toast.warn("you cannot send same value more than 1 time", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", JSON.stringify(data.image));
      formData.append("from", data.userName);
      formData.append("from_user_id", data.userId);
      formData.append("to", user.name);
      formData.append("to_user_id", id ?? "");
      formData.append("celebration_moment", selectedOption.toLocaleLowerCase());
      formData.append("celebrating_value", celebrationMoment);
      formData.append(
        "company",
        JSON.stringify({
          id: company_id,
          company_name: company_id_map.get(company_id),
        })
      );
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/make-transaction`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        toast.success("Transaction completed!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(true);
        setTimeout(() => {
          navigator(`/my-profile/${userId}`);
        }, 500);
      } else {
        setIsLoading(false);
        toast.error("internel server error", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (err) {
      console.log("Error while sending coins");
      console.error(err);
    }
  };

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/all-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ company_id }),
        }
      );
      if (response) {
        const jsonData = await response.json();
        const user = jsonData.find((eachUser: User) => eachUser.user_id === id);
        if (user) {
          setUser(user);
        } else {
          console.log("User not found");
        }
      }
    } catch (err) {
      console.log("Error while fetching users");
      console.error(err);
    }
  }, [id]);

  const checkOptions = useCallback(async () => {
    try {
      const response: any = await fetch(
        `${process.env.REACT_APP_API_URL}/get-values`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            from_user_id: userId,
            to_user_id: id,
          }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        setSelectedValues(result);
      }
    } catch (error) {
      console.log("Error while fetching transactions", error);
    }
  }, [id, userId]);

  useEffect(() => {
    fetchAllUsers()
      .then(() => {
        console.log("Fetched all users successfully");
        checkOptions()
          .then(() => {
            console.log("Fetched values");
            setIsLoading(false);
          })
          .catch((error) => {
            console.log("Fetched all users failed", error);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [checkOptions, fetchAllUsers]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
      />
      <div className={styles["sendPage"]}>
        <div className={styles["sendPage__header"]}>
          <Header
            navigateTo={"/profile"}
            content={"Who do you want to Celebrate?"}
          />
        </div>
        <div className={styles["sendPage__content"]}>
          <div className={styles["sendPage__content-user-info"]}>
            <div className={styles["sendpage__content-profile"]}>
              <ProfileWithCoin userDetails={user} />
            </div>
            <div className={styles["sendpage__content-coin"]}>
              <img src={coin} alt="" />
              <div className={styles["sendpage__content-coin-amount"]}>
                +1 Coin
              </div>
            </div>
          </div>
          <div className={styles["sendPage__content-input"]}>
            <div className={styles["sendPage__content-radio"]}>
              <label>Select the value you’re celebrating:</label>
              <select
                id="cars"
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                }}
                value={selectedOption}
              >
                {valueInfo.map((valueInfo: any) => {
                  let res = valueInfo;
                  let value = valueInfo;
                  if (valueInfo === "Problem Solving") {
                    res = "Problem_Solving";
                    value = "Problem-solving";
                  } else if (valueInfo === "Open Minded") {
                    res = "Open_minded";
                    value = "Open-minded";
                  }
                  if (seletectedValues.includes(value)) {
                    return (
                      <option className="options" disabled value={res}>
                        {valueInfo}
                      </option>
                    );
                  } else {
                    return (
                      <option className="options" value={res}>
                        {valueInfo}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className={styles["sendPage__content-text"]}>
              <label htmlFor="">
                Share the moment of Celebration:
                <span
                  style={
                    celebrationMoment.length < 200 &&
                    celebrationMoment.length >= 20
                      ? {
                          color: "green",
                          fontSize: "12px",
                          marginLeft: "7px",
                        }
                      : {
                          color: "red",
                          fontSize: "12px",
                          marginLeft: "7px",
                        }
                  }
                >
                  (Characters Left {200 - celebrationMoment.length})
                </span>
              </label>
              <textarea
                name="Text1"
                cols={60}
                onChange={(e) => handleOnChangeForTextArea(e)}
                value={celebrationMoment}
                placeholder="Type the reason..."
                rows={8}
              ></textarea>
            </div>
            <div className={styles["sendPage__content-button"]}>
              <Button handleClick={sendCoins} content={"Celebrate Becoming"} />
            </div>
          </div>
        </div>
        <div className={styles["navbar"]}>
          <FooterNavbar userid={userId} />
        </div>
      </div>
    </>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import ProfileWithCoin from "../components/ProfileWithCoin";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import FooterNavbar from "../components/FooterNavbar";
const styles = require("../styles/profile.module.css").default;

function Profile() {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState<any>(true);

  const navigation = useNavigate();

  const userData: any = localStorage.getItem("userInfo");
  const data = JSON.parse(userData);
  let userId = data?.userId;
  const company_id = data?.company.id;

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
      if (!response.ok) throw new Error("Error while fetching users");
      if (response) {
        const jsonData = await response.json();
        const result = await jsonData.filter((eachUser: any) => {
          return eachUser.user_id !== userId;
        });
        result.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setAllUsers(result);
      }
    } catch (err) {
      console.log("Error while fetching users");
      console.error(err);
    }
  }, [userId]);

  const handleUserClick = (user_id: string) => {
    navigation(`/send/${user_id}`);
  };

  useEffect(() => {
    fetchAllUsers()
      .then(() => {
        console.log("Fetched all users successfully");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fetchAllUsers]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <div className={styles["profile"]}>
        <Header
          navigateTo={`/my-profile/${userId}`}
          content={"Back to Profile"}
        />
        <div className={styles["profile__users"]}>
          {allUsers.map((eachUser: any) => {
            return (
              <div
                key={eachUser.user_id}
                onClick={() => handleUserClick(eachUser.user_id)}
                className={styles["profile__users-singleuser"]}
              >
                <ProfileWithCoin userDetails={eachUser} />
              </div>
            );
          })}
        </div>
        <div className={styles["navbar"]}>
          <FooterNavbar userid={userId} />
        </div>
      </div>
    </>
  );
}

export default Profile;
